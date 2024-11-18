### **InsightParse ~Resume Insights Extractor** 🚀  
_A cutting-edge tool for automated resume analysis using Generative AI .

---

### **Project Overview**  
The **Resume Insights Extractor** streamlines the process of analyzing resumes by extracting critical information such as personal details, skills, experience, and embedded photos. Built using Generative AI, it leverages state-of-the-art technologies for efficient and accurate processing.

---

### **Key Features**  
1. **Seamless Resume Parsing**  
   - Automatically extracts structured information from resumes, including:
     - **Name**
     - **Contact Information**
     - **Skills**
     - **Experience**
     - **Education**
     - Embedded **photos** from resumes.

2. **Advanced Generative AI Technology**  
   - Powered by **Gemini 1.5 Pro** LLM for natural language understanding and context-aware analysis.

3. **Tech Stack**  
   - **Streamlit**: Provides an intuitive user interface for seamless interaction.
   - **LangChain**: Manages and chains generative AI prompts for efficient resume parsing.
   - **Llama Parser**: Handles pdf text extraction and segmentation tasks.
   - **PyMuPDF (fitz)**: Extracts images from PDF files.
   - **Python**: Backend scripting and logic implementation.

4. **Containerization for Easy Deployment**  
   - **Docker** ensures the project is portable, consistent, and can run anywhere without dependency issues.

---

### **How to Use**  

#### **Access the Project (Locally via Docker)**  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/yourusername/resume-insights-extractor.git
   cd resume-insights-extractor
   ```

2. **Build the Docker Image**  
   ```bash
   docker build -t resume_insights_extractor .
   ```

3. **Run the Docker Container**  
   ```bash
   docker run -p 8501:8501 --name resume_extractor_container resume_insights_extractor
   ```

4. **Access the Application**  
   Open your browser and go to:  
   `http://localhost:8501`

---

### **Project Architecture**  
- **Generative AI**: Utilizes **Gemini 1.5 Pro** LLM for semantic understanding.  
- **LangChain Framework**: Chains LLM calls to handle complex resume parsing workflows.  
- **PyMuPDF**: Extracts images directly from PDF files.  
- **Streamlit UI**: Ensures a user-friendly interface for input and output visualization.  
- **Llama Parser**:Handles pdf text extraction and segmentation tasks.

---

### **Folder Structure**  
```plaintext
resume-insights-extractor/
├── app_docker.py         # Main application file
├── Dockerfile            # Docker setup instructions
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
├── README.md             # Project documentation
├── utils/                # Helper functions
├── static/               # Stores extracted images
└── data/                 # Input sample resumes
```

---

### **Technologies Used**  
- **Programming Language**: Python  
- **Generative AI**: Gemini 1.5 Pro  
- **NLP Frameworks**: LangChain, Llama Parser  
- **Visualization**: Streamlit  
- **PDF Processing**: PyMuPDF  

---

### **Future Enhancements**  
0. Segregating Resumes of all candidates present in single pdf file of entire organization .(complex case)
1. Extend support for multiple file formats (e.g., Word, plain text).  
2. Incorporate multilingual resume parsing capabilities.  
3. Add resume scoring based on predefined job descriptions.  

---

### **Contributors**  
- **Shubham Murtadak**:GenAI Developer and Architect  

---

Feel free to suggest changes or contribute to the project via pull requests! 😊  
