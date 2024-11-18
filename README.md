### **InsightParse ~ Resume Insights Extractor** 🚀✨  
Your go-to tool for automated, intelligent resume analysis powered by **Generative AI**!

---

### **🔍 Project Overview**  
**InsightParse** is a cutting-edge solution designed to simplify resume analysis. With just a click, extract vital information like **personal details**, **skills**, **experience**, and even embedded **photos**. Harness the power of **Generative AI** for fast, accurate, and seamless processing! 🌟  

---

### **🌟 Key Features**  
1. **📄 Seamless Resume Parsing**  
   Extracts key details with ease, including:  
   - **Name** 🧑‍💼  
   - **Contact Information** 📞  
   - **Skills** 🛠️  
   - **Experience** 🏢  
   - **Education** 🎓  
   - Embedded **photos** 📸  

2. **🤖 Advanced Generative AI Technology**  
   - Powered by **Gemini 1.5 Pro LLM** for context-aware and human-like understanding.  

3. **⚙️ Modern Tech Stack**  
   - **Streamlit**: Beautiful and interactive UI 🌈.  
   - **LangChain**: Efficient management of AI workflows 🛠️.  
   - **Llama Parser**: Handles PDF text segmentation 📄.  
   - **PyMuPDF (fitz)**: Extracts images directly from PDFs 🖼️.  
   - **Python**: Core backend scripting 🐍.  

4. **🐳 Containerized for Simplicity**  
   - Fully **Dockerized** for easy deployment and consistent performance.  

---

### **🚀 How to Use**  

#### **Run the Project Locally with Docker**  

1. **📥 Clone the Repository**  
   ```bash
   git clone https://github.com/yourusername/resume-insights-extractor.git
   cd resume-insights-extractor
   ```

2. **🛠️ Build the Docker Image**  
   ```bash
   docker build -t resume_insights_extractor .
   ```

3. **▶️ Run the Docker Container**  
   ```bash
   docker run -p 8501:8501 --name resume_extractor_container resume_insights_extractor
   ```

4. **🌐 Access the Application**  
   Open your browser and navigate to:  
   **http://localhost:8501** 🌟  

---

### **🛠️ Project Architecture**  
- **🤖 Generative AI**: **Gemini 1.5 Pro LLM** for smart semantic understanding.  
- **🔗 LangChain Framework**: For handling multi-step AI workflows.  
- **📄 PyMuPDF**: Direct image extraction from PDF files.  
- **✨ Streamlit**: Interactive and user-friendly visualization.  
- **📂 Llama Parser**: For text segmentation and processing.  

---

### **📂 Folder Structure**  
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

### **💡 Future Enhancements**  
✨ Exciting features planned:  
1. **📁 Advanced Multi-Resume Parsing**: Handle complex cases like bulk organizational resumes.  
2. **🌐 Multilingual Parsing**: Support for resumes in multiple languages.  
3. **📊 Resume Scoring**: Intelligent ranking based on job descriptions.  
4. **📝 Extended File Formats**: Support for Word, plain text, and more.

---

### **🤝 Contributors**  
- **Shubham Murtadak**: _GenAI Developer and Solution Architect_ 🎉  

---

### **🔗 Contribute & Feedback**  
Feel free to:  
- ⭐ Star the repository  
- 💬 Open issues  
- 📤 Submit pull requests  

Together, let’s make recruitment smarter and simpler! 😊  

---  

🎉 **Empowering smarter hiring with InsightParse!**
