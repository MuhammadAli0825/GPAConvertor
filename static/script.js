document.addEventListener("DOMContentLoaded", function () {
    updateMaxGPA();
    document.getElementById("gradingScale").addEventListener("change", updateMaxGPA);
});
function updateMaxGPA() {
    let scale = parseFloat(document.getElementById("gradingScale").value);
    document.querySelectorAll('.gpa').forEach(input => {
        input.max = scale;
        validateGPA(input);
    });
}

function validateGPA(input) {
    let scale = parseFloat(document.getElementById("gradingScale").value);
    let gpa = parseFloat(input.value);

    if (isNaN(gpa) || gpa < 0) {
        input.value = "";
    } else if (gpa > scale) {
        input.value = scale;
    }
}

function validateCreditHours(input) {
    let value = input.value;
    if (!/^[1-9]\d*$/.test(value)) {
        input.value = "";
    }
}

function addRow() {
    const tableBody = document.querySelector("#gpaTable tbody");
    const rowCount = tableBody.rows.length + 1;
    if (rowCount > 14) {
        alert("Maximum of 14 semesters are allowed.");
        return;
    }
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>Semester ${rowCount}</td>
        <td><input type="number" step="0.1" class="gpa" placeholder="Enter GPA" min="0" oninput="validateGPA(this)"></td>
        <td><input type="number" step="1" class="creditHours" placeholder="Enter Credit Hours" min="1" oninput="validateCreditHours(this)"></td>
        <td><button type="button" class="del-btn" onclick="removeRow(this)">Delete</button></td>
    `;
    tableBody.appendChild(newRow);
}
function removeRow(button) {
    button.closest("tr").remove();
}
function calculateCGPA() {
    const gpaInputs = document.querySelectorAll(".gpa");
    const creditInputs = document.querySelectorAll(".creditHours");
    let totalWeightedGPA = 0;
    let totalCredits = 0;
    let validInputs = true;
    for (let i = 0; i < gpaInputs.length; i++) {
        let gpa = parseFloat(gpaInputs[i].value);
        let credits = parseFloat(creditInputs[i].value);
        if (isNaN(gpa) || isNaN(credits) || gpa < 0 || gpa > 10 || credits <= 0) {
            validInputs = false;
            break;
        }
        totalWeightedGPA += gpa * credits;
        totalCredits += credits;
    }
    const resultDisplay = document.querySelector("#result");
    if (!validInputs) {
        resultDisplay.textContent = "Error: Please enter valid GPA and Credit Hours.";
        resultDisplay.style.color = "red";
    } else if (totalCredits === 0) {
        resultDisplay.textContent = "Error: Total credit hours cannot be zero.";
        resultDisplay.style.color = "red";
    } else {
        const cgpa = totalWeightedGPA / totalCredits;
        resultDisplay.textContent = `Your CGPA is: ${cgpa.toFixed(2)}`;
        resultDisplay.style.color = "green";
    }
}
function resetForm() {
    document.querySelector("#gpaTable tbody").innerHTML = `
        <tr>
            <td>Semester 1</td>
            <td><input type="number" step="0.1" class="gpa" placeholder="Enter GPA" min="0" max="10"></td>
            <td><input type="number" step="1" class="creditHours" placeholder="Enter Credit Hours" min="1"></td>
            <td><button class="del-btn" onclick="removeRow(this)">Delete</button></td>
        </tr>
        <tr>
            <td>Semester 2</td>
            <td><input type="number" step="0.1" class="gpa" placeholder="Enter GPA" min="0" max="10"></td>
            <td><input type="number" step="1" class="creditHours" placeholder="Enter Credit Hours" min="1"></td>
            <td><button class="del-btn" onclick="removeRow(this)">Delete</button></td>
        </tr>
    `;
    document.querySelector("#result").textContent = "";
}