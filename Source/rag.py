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



def retrive_data(question,pdf_name):
    print("inside retriver !")
 
    # pdf_name=pdf_name.rsplit('.', 1)[0]
    vdb_path=os.path.join(PROJECT_HOME_PATH,'Database','chroma_db')

    pdf_name_clean = re.sub(r'[^a-zA-Z0-9]', '', pdf_name).replace('.pdf', '')

    print(f"clean pdf name is :{pdf_name_clean}")
    #load vector-store data
    vectorstore = Chroma(embedding_function=embed_model,
                      persist_directory=vdb_path,
                      collection_name=pdf_name_clean)
    
    # Retrieving & querying  documents 
    retriever = MultiQueryRetriever.from_llm(
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k":10}),
        llm=llm
    )
 
    docs = retriever.invoke(input=question)
    
    no_of_doc=len(docs)
    print(docs,no_of_doc)
    # vectorstore.close()
    return docs,no_of_doc


def parsed_resume(pdf_name):
    try:
        # Get the form data from the request
        # query = request.form.get('question')  # 'question' is the name attribute from the form
        query= "Extract structured information from the context, including a summary, personal details, experience, qualifications, certifications, current residency, citizenship, and notice period "

        # data = request.get_json()
        # query = data.get('query')

        # print(f"Query: {query}")

        docs,no_of_docs=retrive_data(query,pdf_name)

        # print(docs)

        contexts= "\n---\n".join([f"{d.page_content} {d.metadata}" for d in docs])

        
        QA_PROMPT= PromptTemplate(
                input_variables=["contexts"],
                template = """
                        You are a specialized assistant named ResumeParseAI, designed to extract structured information from resumes efficiently. Your task is to analyze the provided resume content and present the extracted information in a predefined format.

                        **Instructions:**\n 
                        - Analyze the provided resume content systematically.\n
                        - Extract information under the following categories:\n
                        - 1.**Personal Details**: Name, contact information, address, and other personal details.\n
                        - 2.**Experience**: Job roles, responsibilities, achievements, and years of experience.\n
                        - 3.**Education and Certifications**: Academic qualifications and certifications.\n
                        - 4.**Skills**: Key skills and competencies mentioned.\n
                        - 5.**Projects**: Details of significant projects undertaken.\n
                        - 6.**Languages**: Languages known or mentioned.\n
                        - 7.**Notice Period**: Mention the notice period if specified.\n
                        - If a category is missing or not mentioned, include "Not Available."\n

                        - Create Short summary about candidate based on context 
                        -1.**Summary**:Create a short summary about candidate based on context.\n

                        - Present extracted information in a clean, structured format.\n

                        **Context:**  \n
                        {contexts}  

                        **Output Format:**\n
                        - **Personal Details**:\n
                        - **Name**: [Candidate Name]\n
                        - **Contact Information**: [Phone, Email]\n
                        - **Address**: [City, State, Country]\n
                        - **Experience**:\n
                        - [Role 1]: [Company, Duration, Key Responsibilities]\n
                        - [Role 2]: [Company, Duration, Key Responsibilities]\n
                        - **Education and Certifications**:\n
                        - [Degree, Institution, Year]\n
                        - [Certification, Issuer, Year]\n
                        - **Skills**:\n
                        - [Skill 1]\n
                        - [Skill 2]\n
                        - **Projects**:\n
                        - [Project Name]: [Brief Description]\n
                        - **Languages**:\n
                        - [Language 1], [Language 2]\n
                        - **Notice Period**: [Notice Period or "Not Available"]\n

                         **Summary**: [Brief professional summary]\n
                """
            )
        
       
        #Initializng rag chain 
        rag_chain = (
            {"contexts":itemgetter("contexts"),}
            | QA_PROMPT
            | llm
        )

        #Step VI:Envoke the chain
        answer=rag_chain.invoke({"contexts":contexts})

        print()
        print("answer 1:")
        print(answer)
        print()

        answer=answer.content

        return answer
        
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})