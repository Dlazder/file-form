const fileInput = document.querySelector('input[type="file"]');
const imgContainer = document.querySelector('.uploaded-images');
let uploadedImages = [];


fileInput.addEventListener('change', () => {
    let fileList = fileInput.files;

    for (let i = 0; i < fileList.length; i++) {

        const file = fileList[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const base64Img = reader.result.split(',')[1];
            const fileName = file.name;
            uploadedImages.push(fileName);
            fetch('/file', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({fileName, base64Img})})
            .then(res => {
                const div = document.createElement('div');
                div.className = 'img__item';
                div.dataset.image = fileName;
                div.innerHTML = `
                <img src="${reader.result}"></img>
                <span class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class=""><path fill-rule="evenodd" d="M6.586 8L4.293 5.707a.999.999 0 111.414-1.414L8 6.586l2.293-2.293a1 1 0 011.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8z"></path></svg></span>
                `;
                div.querySelector('.delete-btn').addEventListener('click', () => {
                    div.remove()
                    fetch('/delete-file', {method: 'POST', body: div.dataset.image})
                });
                imgContainer.appendChild(div);
            })
            .catch(err => console.error('There was a problem with a fetch operation:', err))
        }
        
    }

})
