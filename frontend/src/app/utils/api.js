const BASE_URL = "http://127.0.0.1:8000";

/**
 * Dispatches multipart form data containing resumes and JDs to the FastAPI backend.
 * @param {string} jobDescription 
 * @param {File} file 
 */
export const analyzeProfile = async (jobDescription, file) => {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/api/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server exception code: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Network gateway error:", error);
    throw error;
  }
};