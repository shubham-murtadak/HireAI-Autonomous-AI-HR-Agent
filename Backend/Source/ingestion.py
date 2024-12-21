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

from ingestion import parsed_pdf_data,load_parsed_data




GROQ_API_KEY=os.getenv("GROQ_API_KEY")
LLAMA_CLOUD_API_KEY=os.getenv("LLAMA_CLOUD_API_KEY")
GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")
PROJECT_HOME_PATH=os.getenv('PROJECT_HOME_PATH')


# Initialize Embeddings
embed_model = FastEmbedEmbeddings(model_name="BAAI/bge-base-en-v1.5")





# Create vector database
def create_vector_database(pdf_name):
   
    parsed_pdf_data(pdf_name)
    # Call the function to either load or parse the data
    llama_parse_documents = load_parsed_data()
    # print(llama_parse_documents[0].text[:300])

    markdown_file_name_with_path=os.path.join(PROJECT_HOME_PATH,'Data','Markdown_store','output.md')
    
    markdown_file_folder=os.path.join(PROJECT_HOME_PATH,'Data','Markdown_store')
   

    if os.path.exists(markdown_file_folder):
        print(f"deleting existing markdown folder :{markdown_file_folder}")
        # Remove the folder and its contents
        shutil.rmtree(markdown_file_folder)
    
    os.makedirs(markdown_file_folder,exist_ok=True)

    with open(markdown_file_name_with_path, 'a',encoding="utf8",errors="surrogateescape") as f:  # Open the file in append mode ('a')
        for doc in llama_parse_documents:
            f.write(doc.text + '\n')


    try:
        loader = UnstructuredMarkdownLoader(markdown_file_name_with_path)

        documents = loader.load()
    except Exception as e:
        print(f"error:{e}")

    # print("documents:",documents)
    # Split loaded documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)

    #len(docs)
    # print(f"length of documents loaded: {len(documents)}")
    # print(f"total number of document chunks generated :{len(docs)}")
    #docs[0]
    vdb_path=os.path.join(PROJECT_HOME_PATH,'Database','chroma_db')
    # D:\personal\Personal Projects\DocEase~Chat with Pdf\backend\Database\chroma_db

    # Check if the folder exists
    # if os.path.exists(vdb_path):
    #     # Remove the folder and its contents
    #     shutil.rmtree(vdb_path)
    #     print(f"deleting existing vectordb :{vdb_path}")

    # print(vdb_path)
    
    # pdf_name=pdf_name.rsplit('.', 1)[0].strip()
    pdf_name_clean = re.sub(r'[^a-zA-Z0-9]', '', pdf_name).replace('.pdf', '')

    # print(f"clean pdf name is :{pdf_name_clean}")
    # Create and persist a Chroma vector database from the chunked documents
    vs = Chroma.from_documents(
        documents=docs,
        embedding=embed_model,
        persist_directory=vdb_path,  # Local mode with in-memory storage only
        collection_name=pdf_name_clean
    )

    print('Vector DB created successfully !')
    return vs,embed_model