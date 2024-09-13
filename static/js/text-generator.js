
document.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("search-box");
    input.addEventListener('keydown', function (event) {

        if (event.key === 'Enter') {
            event.preventDefault();
            console.log("enter")
            let section = input.dataset.sectionName;
            getContent(section);

        }
    });

});
const maxRequst = 2
let currentReqCount = 1


function insertAnswer(index, answer) {
    let answerBox = document.getElementById("result-box")
    console.log(answerBox)
    const id = "answer-" + index
    let answerItem = document.createElement("li")
    let button = document.createElement("button")
    let answerText = document.createElement("p")
    answerItem.classList.add("answers")
    button.classList.add("answer-btns");

    answerText.id = id
    answerText.textContent = answer;

    button.innerHTML = '<i class="fa-regular fa-copy"></i>';

    button.addEventListener("click", () => {
        copyAnswer(answer, button);
    });
    answerItem.appendChild(button);
    answerItem.appendChild(answerText);

    // Inserting the answer on top of old answeers if they exist; second children is indexed because of the loading element being the first child 
    if (answerBox.children.length > 1) {
        answerBox.insertBefore(answerItem, answerBox.children[1]);
    } else {
        answerBox.appendChild(answerItem);
    }


}
function getContent(section) {
    if (currentReqCount > maxRequst) {
        showInformBox("Current version of the resume buider don't allow user to generate text more than two time per section.")
        return
    }
    let input = document.getElementById("search-box");
  

    let position = input.value
    if (!section || !position) {
        input.placeholder = "Please describe your profession. E.g Full-stack developer";
        return
    }
    let loader = document.getElementById("loading-placeholder")
    loader.style.display = "flex";

    fetch('/contents/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            section,
            profession: position,
        })
    })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                return response.json().then(errorText => {
                    throw new Error(errorText || 'Unknown error occurred');
                });
            }
            return response.json();
        })
        .catch(error => {

            console.error('Error:', error.message);

        })
        .then(data => {
            currentReqCount++;
            console.log('Response Data:', data.result);
            document.getElementById("loading-placeholder").style.display = "none";

            for (let i = 0; i < data.result.length; i++) {
                let answer = data.result[i]
                insertAnswer(i, answer)

            }
        });
}

