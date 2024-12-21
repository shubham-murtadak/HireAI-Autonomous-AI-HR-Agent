# Core Libraries
import os
import sys
import uuid
import time
import shutil
import warnings
from typing import List
from urllib.parse import quote_plus
from operator import itemgetter

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

from Source.parser import parsed_pdf_data,load_parsed_data,extract_images_from_pdf
from Source.ingestion import create_vector_database
from Source.rag import parse_resume

# Load Environment Variables
load_dotenv()
warnings.filterwarnings("ignore")




GROQ_API_KEY=os.getenv("GROQ_API_KEY")
LLAMA_CLOUD_API_KEY=os.getenv("LLAMA_CLOUD_API_KEY")
GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")
PROJECT_HOME_PATH=os.getenv('PROJECT_HOME_PATH')


# Initialize Embeddings
embed_model = FastEmbedEmbeddings(model_name="BAAI/bge-base-en-v1.5",cache_dir='./cache')



#initialize llm model instance 
llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-pro",
                    google_api_key=GEMINI_API_KEY,
                    temperature=0,
                    verbose=True
                    )



def upload_pdf():
        timestamp = str(int(time.time()))  # Generate a unique timestamp
    
        image_output_dir="./static/images"
        uploaded_file = request.files['file']
        print(uploaded_file)
        if uploaded_file.filename != '':
            target_directory =os.path.join(PROJECT_HOME_PATH,'Data','Pdf_Store')
            # target_directory = ".\docs"
            os.makedirs(target_directory, exist_ok=True)
            # unique_filename = str(uuid.uuid4()) + ".pdf"
            unique_filename=uploaded_file.filename

            print(f"unqiue filename :{unique_filename}")
            file_path = os.path.join(target_directory, unique_filename)
            print(file_path)
            uploaded_file.save(file_path)
            print(f"pdf saved at location :{file_path} successfully !")
            extract_images_from_pdf(file_path,image_output_dir)

            print(f"image extracted successfully at location:{image_output_dir} !!!")

            parsed_pdf_data(unique_filename)
            parsed_data=load_parsed_data()
            # print(parsed_data)
            vs,embed_model=create_vector_database(unique_filename)

            return render_template('index.html', timestamp=timestamp)
        


if __name__ == '__main__':
    # Streamlit UI Configuration
    st.set_page_config(page_title="Resume Parsing Tool", page_icon="📄", layout="centered")

    # Title Section
    st.markdown(
        """
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4CAF50; font-size: 2.5em;">📄 Resume Parsing Tool</h1>
            <p style="color: #555;">Easily upload your resume and extract key insights with AI!</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Initialize session state for storing image path
    if 'image_path' not in st.session_state:
        st.session_state.image_path = None

    # Main Content Container
    with st.container():
        st.markdown("<h3 style='text-align: center;'>Upload Your Resume</h3>", unsafe_allow_html=True)

        # Form-like centered layout with restricted width
        with st.form("resume_form"):
            st.markdown(
                """
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                """,
                unsafe_allow_html=True,
            )

            # File Upload
            uploaded_pdf = st.file_uploader(
                "Select a PDF file:",
                type=["pdf"],
                label_visibility="collapsed",
                help="Upload a single PDF file only.",
            )

            st.markdown("</div>", unsafe_allow_html=True)

            # Buttons in a compact row layout
            col1, col2 = st.columns(2, gap="small")
            with col1:
                create_vdb_clicked = st.form_submit_button("📂 Parse Resume")
            with col2:
                parse_resume_clicked = st.form_submit_button("🔍 Extract Resume Info")

        # Handle actions
        if uploaded_pdf:
            # Save the uploaded PDF file to the desired path
            upload_folder = r"D:\personal\Interview-Assignments\alazka.ai\Data\Pdf_Store"
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)  # Ensure the directory exists
            
            pdf_path = os.path.join(upload_folder, uploaded_pdf.name)
            with open(pdf_path, "wb") as f:
                f.write(uploaded_pdf.getbuffer())

            # Display spinner for upload confirmation
            with st.spinner("Uploading and processing the PDF..."):
                time.sleep(1.5)  # Simulate upload delay
            st.success(f"Uploaded: {uploaded_pdf.name}")
            pdf_name = uploaded_pdf.name

            # Store the uploaded PDF path in session state
            #  = pdf_path

            if create_vdb_clicked:
                # Display spinner while creating vector database
                with st.spinner("Parsing resume and creating vector database..."):
                    image_path="D:/personal/Interview-Assignments/alazka.ai/static/images"
                    extract_images_from_pdf(pdf_path,image_path)
                    vdb_status = create_vector_database(pdf_name)

                st.success("Resume parsed successfully!")

            if parse_resume_clicked:
                # Display spinner while extracting resume information
                with st.spinner("Extracting resume information..."):
                    resume_info = parsed_resume(pdf_name)

                    # Display Photo if image path is available
                    if st.session_state.image_path:
                        st.subheader("Photo Preview:")
                        st.session_state.image_path="D:/personal/Interview-Assignments/alazka.ai/static/images/image.jpeg"
                        image_path = st.session_state.image_path

                        print("Image path in streamlit :", image_path)
                        try:
                            # Open and resize the image
                            image = Image.open(image_path)
                            max_width, max_height = 300, 300  # Set your desired max width and height
                            image.thumbnail((max_width, max_height))

                            # Display the resized image
                            st.image(image, caption="Resume Photo", use_column_width=False)
                        except Exception as e:
                            st.error(f"Error loading image: {e}")

                    # Display Resume Information
                    st.subheader("Extracted Information:")
                    st.info(resume_info)
                    st.success("Resume parsing completed successfully!")
        else:
            st.info("Please upload a PDF file to proceed.")

    # Footer Section
    st.markdown(
        """
        <hr>
        <footer style="text-align: center; color: #888; margin-top: 20px;">
            Developed with ❤️ using Streamli
        </footer>
        """,
        unsafe_allow_html=True,
    )
