from dotenv import load_dotenv, find_dotenv
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
# from langchain.chat_models import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.retrievers.multi_query import MultiQueryRetriever
# from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain.chains import RetrievalQA
from groq import Groq
from langchain_groq import ChatGroq
import os
import shutil
import sys
from PyPDF2 import PdfReader
from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import uuid
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from groq import Groq
from langchain_groq import ChatGroq
from llama_parse import LlamaParse
#
import joblib
import os
import nest_asyncio  # noqa: E402
nest_asyncio.apply()


#28-10-2024

#28-10-2024
import bs4
from langchain_core.messages import HumanMessage
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory

import time
from typing import List
from langchain.schema import Document


from langchain.chains import create_history_aware_retriever, create_retrieval_chain
import atexit

from langchain.retrievers.multi_query import MultiQueryRetriever

from operator import itemgetter

load_dotenv()

import warnings
warnings.filterwarnings("ignore")
from urllib.parse import quote_plus

import fitz  # PyMuPDF
import os

import streamlit as st
import re 
from PIL import Image
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import pymupdf

import nltk
nltk.download('punkt_tab')


GROQ_API_KEY=os.getenv("GROQ_API_KEY")
LLAMA_CLOUD_API_KEY=os.getenv("LLAMA_CLOUD_API_KEY")
GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")
PROJECT_HOME_PATH=os.getenv('PROJECT_HOME_PATH')

print(GROQ_API_KEY)
print(LLAMA_CLOUD_API_KEY)
print(GEMINI_API_KEY)
print(PROJECT_HOME_PATH)


# Initialize Embeddings
# embed_model = FastEmbedEmbeddings(model_name="BAAI/bge-base-en-v1.5")

# Defining Gemini Embeddings
# embed_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GEMINI_API_KEY)
embed_model = FastEmbedEmbeddings()


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


# app = Flask(__name__)
# CORS(app)

# @app.route('/')
# def index():
#     return render_template('index.html')


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

        print(documents)
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

def extract_images_from_pdf(pdf_path, output_dir):
   
    # Check if the folder exists
    if os.path.exists(output_dir):
        # Remove the folder and its contents
        shutil.rmtree(output_dir)
        print(f"Deleting existing image folder to clear data: {output_dir}")

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Open the PDF file
    # pdf_file = fitz_open(pdf_path)
    pdf_file =pymupdf.open(pdf_path)
    print("fits open sucessfull !!")

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


# @app.route('/', methods=['GET', 'POST'])
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
    # print(docs,no_of_doc)
    # vectorstore.close()
    return docs,no_of_doc

# @app.route('/parsed_resume', methods=['POST'])
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

                        **Your key expertise includes:**\n
                        1. Extracting and structuring information from resume text or PDF content.\n
                        2. Organizing extracted data into clear, professional categories.\n
                        3. Ensuring sensitive data (e.g., contact information) is labeled appropriately.\n
                        4. Formatting responses for maximum clarity using **Markdown**.\n

                        **Instructions:**\n
                        - Analyze the provided resume content systematically.\n
                        - Extract information under the following categories:\n
                        - **Personal Details**: Name, contact information, address, and other personal details.\n
                        - **Summary**: A brief professional summary of the candidate.\n
                        - **Experience**: Job roles, responsibilities, achievements, and years of experience.\n
                        - **Education and Certifications**: Academic qualifications and certifications.\n
                        - **Skills**: Key skills and competencies mentioned.\n
                        - **Projects**: Details of significant projects undertaken.\n
                        - **Languages**: Languages known or mentioned.\n
                        - **Notice Period**: Mention the notice period if specified.\n
                        - If a category is missing or not mentioned, include "Not Available."\n
                        - Present extracted information in a clean, structured format.\n

                        **Context:**  \n
                        {contexts}  

                        **Output Format:**\n
                        - **Personal Details**:\n
                        - **Name**: [Candidate Name]\n
                        - **Contact Information**: [Phone, Email]\n
                        - **Address**: [City, State, Country]\n
                        - **Summary**: [Brief professional summary]\n
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
            # upload_folder = r"D:\personal\Interview-Assignments\alazka.ai\Data\Pdf_Store"
            upload_folder = "./Data/Pdf_Store"
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
                    image_path="./static/images"
                    extract_images_from_pdf(pdf_path,image_path)
                    vdb_status = create_vector_database(pdf_name)

                st.success("Resume parsed successfully!")

            if parse_resume_clicked:
                # Display spinner while extracting resume information
                with st.spinner("Extracting resume information..."):
                    resume_info = parsed_resume(pdf_name)

                    # # Display Photo if image path is available
                    # if st.session_state.image_path:
                    st.subheader("Photo Preview:")
                        # st.session_state.image_path="D:/personal/Interview-Assignments/alazka.ai/static/images/image.jpeg"
                        # st.session_state.image_path = "./static/images/image.jpeg"
                    image_path="./static/images/image.jpeg"
                        # image_path = st.session_state.image_path

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
            Developed with ❤️ using Streamlit
        </footer>
        """,
        unsafe_allow_html=True,
    )
