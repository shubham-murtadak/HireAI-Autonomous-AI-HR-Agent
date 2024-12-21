# Core Libraries
import os
import sys
import uuid
import time
import shutil
import warnings
from typing import List
from urllib.parse import quote_plus

# Environment and Asynchronous Handling
from dotenv import load_dotenv, find_dotenv
import nest_asyncio  
nest_asyncio.apply()

# PDF and File Handling
from PyPDF2 import PdfReader
import fitz  # PyMuPDF
from PIL import Image

# Flask for Web Framework
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# LangChain Core
from langchain.schema import Document
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA, ConversationalRetrievalChain, create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_community.chat_message_histories import ChatMessageHistory

# LangChain Document Loaders
from langchain_community.document_loaders import PyPDFLoader, UnstructuredMarkdownLoader

# LangChain Integrations
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from groq import Groq
from llama_parse import LlamaParse

# Utility Libraries
import bs4
import joblib
import re
import atexit

# Streamlit for UI (if applicable)
import streamlit as st

# Load Environment Variables
load_dotenv()
warnings.filterwarnings("ignore")




GROQ_API_KEY=os.getenv("GROQ_API_KEY")
LLAMA_CLOUD_API_KEY=os.getenv("LLAMA_CLOUD_API_KEY")
GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")
PROJECT_HOME_PATH=os.getenv('PROJECT_HOME_PATH')



# Initialize Embeddings
embed_model = FastEmbedEmbeddings(model_name="BAAI/bge-base-en-v1.5")




#initialize llm model instance 
llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-pro",
                    google_api_key=GEMINI_API_KEY,
                    temperature=0,
                    verbose=True
                    )

#create instance of llamaparse
parser = LlamaParse(
    api_key=LLAMA_CLOUD_API_KEY,  # can also be set in your env as LLAMA_CLOUD_API_KEY
    result_type="markdown",  # "markdown" and "text" are available
    verbose=True
)


def extract_images_from_pdf(pdf_path, output_dir):
   
    # Check if the folder exists
    if os.path.exists(output_dir):
        # Remove the folder and its contents
        shutil.rmtree(output_dir)
        print(f"Deleting existing image folder to clear data: {output_dir}")

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Open the PDF file
    pdf_file = fitz_open(pdf_path)
    print("fits open sucessfull !!")
    # pdf_file = fitz.open(pdf_path)

    # Variable to track whether a .jpeg image has been found
    jpeg_found = False

    # Iterate over each page in the PDF
    for page_index in range(len(pdf_file)):
        # Get the page
        page = pdf_file.load_page(page_index)  # Load the page
        image_list = page.get_images(full=True)  # Get images on the page

        # Print the number of images found on the current page
        if image_list:
            print(f"[+] Found a total of {len(image_list)} images on page {page_index + 1}")
        else:
            print(f"[!] No images found on page {page_index + 1}")

        # Iterate over each image found on the page
        for image_index, img in enumerate(image_list, start=1):
            # Get the XREF of the image
            xref = img[0]

            # Extract the image bytes
            base_image = pdf_file.extract_image(xref)
            image_bytes = base_image["image"]

            # Get the image extension (e.g., PNG, JPEG)
            image_ext = base_image["ext"]

            # Process only .jpeg images
            if image_ext == "jpeg" and not jpeg_found:
                # Define the full path where the .jpeg image will be saved
                image_name = os.path.join(output_dir, "image.jpeg")

                # Save the image
                with open(image_name, "wb") as image_file:
                    image_file.write(image_bytes)
                    print(f"[+] .jpeg Image saved as {image_name}")
                
                jpeg_found = True  # Mark that we found the .jpeg image
                break  # Exit the loop once the first .jpeg image is found
        
        # Exit the outer loop if a .jpeg image has been found
        if jpeg_found:
            break


def parsed_pdf_data(pdf_name):

    pdf_file_name_with_path=os.path.join(PROJECT_HOME_PATH,'Data','Pdf_Store',pdf_name)

    parsed_pdf_file_path=os.path.join(PROJECT_HOME_PATH,'Data','Parsed_pdf','parsed_data.pkl')

    parsed_pdf_path=os.path.join(PROJECT_HOME_PATH,'Data','Parsed_pdf')

    if os.path.exists(parsed_pdf_path):
        print(f"deleting existing parsed pdf path :{parsed_pdf_path}")
        shutil.rmtree(parsed_pdf_path)
        

    os.makedirs(parsed_pdf_path,exist_ok=True)
  
    # Perform the parsing step and store the result in llama_parse_documents
    parsingInstructionGeneralized = """
    The provided document may contain various types of content, including text, tables, diagrams, mathematical equations, and HTML/Markdown.

    Follow these instructions carefully to ensure all data is captured accurately:

    1.Text Extraction:
    - Extract all plain text content such as paragraphs, lists, and descriptions.
    - Preserve text formatting like bold, italics, and underlines.
    - Maintain the logical flow of sentences and paragraphs without skipping essential information.

    2.Table Handling:
    - Identify tabular data and extract it in a structured format (CSV or JSON).
    - Ensure correct alignment of rows and columns.
    - Capture table headers and associate them with corresponding data.
    - For complex tables (with multi-level headers or merged cells), ensure proper mapping of the data and explain the table structure.

    3.Diagrams and Images:
    - Extract diagrams, charts, and images and store them separately (e.g., PNG, JPEG).
    - Extract any captions or annotations along with the diagrams.
    - Attempt to capture any embedded text or labels in the diagram.

    4.Mathematical Equations:
    - Identify and extract any mathematical formulas or symbols.
    - Ensure the extraction of superscripts, subscripts, and special characters.
    - Convert the equations to LaTeX or MathML format, if possible.

    5.HTML/Markdown Content:
    - For sections containing HTML, extract the HTML elements (tags, links, images) while preserving the structure.
    - For Markdown sections, retain headings, lists, code blocks, and links in markdown format.
    - Ensure any code snippets remain in their original format.

    6.Document Structure:
    - Preserve the document's hierarchical structure, including headings, subheadings, and sections, to maintain the readability of the parsed content.

    Try to provide an accurate representation of the document, and if questions arise, be as precise as possible when answering based on the parsed content.
    """

    parser = LlamaParse(api_key=LLAMA_CLOUD_API_KEY,
                        result_type="markdown",
                        language='en',
                        parsing_instruction=parsingInstructionGeneralized,
                        max_timeout=5000,)
    
    llama_parse_documents = parser.load_data(pdf_file_name_with_path)

    # Save the parsed data to a file
    joblib.dump(llama_parse_documents, parsed_pdf_file_path)

    # Set the parsed data to the variable
    # parsed_data = llama_parse_documents
    print("Saving the parse results in .pkl format ..........")
    # return parsed_data



def load_parsed_data():
    parsed_pdf_file_path=os.path.join(PROJECT_HOME_PATH,'Data','Parsed_pdf','parsed_data.pkl')
    
    if os.path.exists(parsed_pdf_file_path):
        # Load the parsed data from the file
        parsed_data = joblib.load(parsed_pdf_file_path)

    else:
        print("Error path does not exist !")

    return parsed_data



if __name__=='__main__':
    pdf_path="D://personal//Personal Projects//RecruitAI ~ Autonomous AI HR Agent//Data//Pdf_Store//MUHAMMAD ALI_.pdf"