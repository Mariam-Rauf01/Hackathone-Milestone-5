document.addEventListener('DOMContentLoaded', function () {
    var resumeForm = document.getElementById('resumeForm');
    var resumePreview = document.getElementById('resumePreview');
    var resumeContent = document.getElementById('resumeContent');
    var userNameElement = document.getElementById('userName');
    var profilePicInput = document.getElementById("profilePic");
    var profilePicPreview = document.getElementById("profilePicPreview");
    var profilePicImage = document.getElementById("profilePicImage");
    var profilePicSrc = ""; // Global variable for storing image source
    // Form submit handler
    resumeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        createResume();
    });
    // Image change handler
    if (profilePicInput && profilePicPreview && profilePicImage) {
        profilePicInput.addEventListener("change", function () {
            var _a;
            var file = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var _a;
                    profilePicSrc = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                    profilePicImage.src = profilePicSrc;
                    profilePicPreview.classList.remove("hidden");
                };
                reader.readAsDataURL(file);
            }
            else {
                profilePicPreview.classList.add("hidden");
            }
        });
    }
    // Function to create the resume content
    function createResume() {
        var formData = new FormData(resumeForm);
        var userName = (userNameElement === null || userNameElement === void 0 ? void 0 : userNameElement.value) || 'user';
        var uniquePath = "resumes/".concat(userName.replace(/\s+/g, '_'), "_cv.html");
        // Render Resume Content
        resumeContent.innerHTML = "\n            <div contenteditable=\"true\">\n                <img src=\"".concat(profilePicSrc, "\" alt=\"Profile Picture\" class=\"profile-pic\" />\n                <h2>").concat(formData.get('name'), "</h2>\n                <p>Email: ").concat(formData.get('email'), "</p>\n                <p>Phone: ").concat(formData.get('phone'), "</p>\n                <h3>Education</h3>\n                <p>").concat(formData.get('education'), "</p>\n                <h3>Work Experience</h3>\n                <p>").concat(formData.get('experience'), "</p>\n                <h3>Skills</h3>\n                <p>").concat(formData.get('skills'), "</p>\n            </div>\n        ");
        // Create and Append Download Link
        var downloadLink = document.createElement('a');
        downloadLink.href = "data:text/html;charset=utf-8," + encodeURIComponent(resumeContent.innerHTML);
        downloadLink.download = uniquePath;
        downloadLink.textContent = "Download Your Resume";
        downloadLink.style.display = 'block';
        // Create and Append PDF Download Button (Using Browser's Print to PDF)
        var pdfButton = document.createElement('button');
        pdfButton.textContent = 'Download as PDF';
        pdfButton.onclick = function () { return printResume(); };
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
        var originalContent = document.body.innerHTML;
        document.body.innerHTML = resumeContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
    }
    // Add Editable Listeners
    function addEditableListeners() {
        var editableElements = resumeContent.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(function (element) {
            element.addEventListener('input', function () {
                saveChanges();
            });
        });
    }
    function saveChanges() {
        var editableContent = resumeContent.querySelector('[contenteditable="true"]');
        console.log('Changes saved:', editableContent.innerHTML);
    }
});
