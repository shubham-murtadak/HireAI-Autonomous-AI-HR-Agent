import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi"; // For the upload icon
import { BeatLoader } from "react-spinners"; // Import spinner animation
import { ref, uploadBytesResumable } from "firebase/storage"; // Import Firebase Storage functions
import { storage } from "../../firebase/firebase.config"; // Import Firebase storage instance
import { auth } from "../../firebase/firebase.config";


function UploadDocument() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // To track upload status
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      return toast.error("Please upload a document.");
    }
    const userId = auth.currentUser?.uid || "anonymous_user"; // Replace with appropriate Firebase auth logic

    // Format the current date as YYYY-MM-DD
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    const filePath = `${userId}/${formattedDate}/${selectedFile.name}`;
    console.log("filepath :",filePath)
    const fileRef = ref(storage, filePath); // Define the file path in storage
    const uploadTask = uploadBytesResumable(fileRef, selectedFile); // Upload the file

    setIsUploading(true); // Start the upload animation

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function (optional)
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Error function
        console.error("Error uploading file:", error);
        toast.error(`Error: ${error.message}`);
        setIsUploading(false); // Stop the upload animation on error
      },
      () => {
        // Complete function
        setIsUploading(false); // Stop the upload animation
        toast.success("Document uploaded successfully!");
        navigate("/chatbot"); // Redirect to /chatbot after successful upload
      }
    );
  };

  return (
    <div className="flex justify-center items-start h-screen px-4 bg-gray-50">
      <SEO title={"Upload Document"} />
      
      <div className="w-full max-w-3xl p-6 bg-white shadow-xl rounded-xl border border-gray-300 mt-16">
        <h2 className="text-3xl font-semibold text-black mb-6 text-center">Upload Your Document</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Choose File Section */}
            <div>
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* File Upload Button */}
                <div className="flex flex-col items-center justify-center space-y-2 w-full">
                  <input
                    id="document"
                    type="file"
                    name="document"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <label
                    htmlFor="document"
                    className="cursor-pointer flex items-center justify-center py-8 px-12 bg-gray-700 text-white border-2 border-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 ease-in-out"
                    style={{ width: "80%" }}
                  >
                    <FiUpload className="mr-3 text-2xl" /> Choose File
                  </label>
                </div>

                {selectedFile && (
                  <p className="text-sm text-gray-700 mt-2">Selected file: {selectedFile.name}</p>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <Button
              type="submit"
              className="w-1/3 py-6 bg-gray-800 text-white border-2 border-gray-800 rounded-lg shadow-lg hover:bg-gray-700 hover:text-gray-300 transition-all duration-200 mx-auto block flex items-center justify-center"
            >
              {isUploading ? (
                <BeatLoader size={10} color="#ffffff" /> // Show spinner during upload
              ) : (
                "Upload Document"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadDocument;