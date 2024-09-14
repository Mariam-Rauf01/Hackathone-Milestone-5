document.addEventListener('DOMContentLoaded', () => {
    const resumeForm = document.getElementById('resumeForm') as HTMLFormElement;
    const resumePreview = document.getElementById('resumePreview') as HTMLDivElement;
    const resumeContent = document.getElementById('resumeContent') as HTMLDivElement;
    const userNameElement = document.getElementById('userName') as HTMLInputElement;
    const profilePicInput = document.getElementById("profilePic") as HTMLInputElement | null;
    const profilePicPreview = document.getElementById("profilePicPreview") as HTMLDivElement | null;
    const profilePicImage = document.getElementById("profilePicImage") as HTMLImageElement | null;

    let profilePicSrc = ""; // Global variable for storing image source

    // Form submit handler
    resumeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createResume();
    });

    // Image change handler
    if (profilePicInput && profilePicPreview && profilePicImage) {
        profilePicInput.addEventListener("change", () => {
            const file = profilePicInput.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    profilePicSrc = e.target?.result as string;
                    profilePicImage.src = profilePicSrc;
                    profilePicPreview.classList.remove("hidden");
                };
                reader.readAsDataURL(file);
            } else {
                profilePicPreview.classList.add("hidden");
            }
        });
    }

    // Function to create the resume content
    function createResume() {
        const formData = new FormData(resumeForm);
        const userName = userNameElement?.value || 'user';
        const uniquePath = `resumes/${userName.replace(/\s+/g, '_')}_cv.html`;

        // Render Resume Content
        resumeContent.innerHTML = `
            <div contenteditable="true">
                <img src="${profilePicSrc}" alt="Profile Picture" class="profile-pic" />
                <h2>${formData.get('name')}</h2>
                <p>Email: ${formData.get('email')}</p>
                <p>Phone: ${formData.get('phone')}</p>
                <h3>Education</h3>
                <p>${formData.get('education')}</p>
                <h3>Work Experience</h3>
                <p>${formData.get('experience')}</p>
                <h3>Skills</h3>
                <p>${formData.get('skills')}</p>
            </div>
        `;

        // Create and Append Download Link
        const downloadLink = document.createElement('a');
        downloadLink.href = `data:text/html;charset=utf-8,` + encodeURIComponent(resumeContent.innerHTML);
        downloadLink.download = uniquePath;
        downloadLink.textContent = `Download Your Resume`;
        downloadLink.style.display = 'block';

        // Create and Append PDF Download Button (Using Browser's Print to PDF)
        const pdfButton = document.createElement('button');
        pdfButton.textContent = 'Download as PDF';
        pdfButton.onclick = () => printResume();
        pdfButton.style.display = 'block';

        // Append Download Links to Resume Preview
        resumePreview.innerHTML = '';
        resumePreview.appendChild(resumeContent);
        resumePreview.appendChild(downloadLink);
        resumePreview.appendChild(pdfButton);

        // Make Preview Visible
        resumePreview.classList.remove('hidden');
        addEditableListeners();
    }

    // Function to Print Resume (User can save it as PDF through print dialog)
    function printResume() {
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = resumeContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
    }

    // Add Editable Listeners
    function addEditableListeners() {
        const editableElements = resumeContent.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(element => {
            element.addEventListener('input', () => {
                saveChanges();
            });
        });
    }

    function saveChanges() {
        const editableContent = resumeContent.querySelector('[contenteditable="true"]') as HTMLElement;
        console.log('Changes saved:', editableContent.innerHTML);
    }
});
