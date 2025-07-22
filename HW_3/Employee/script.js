class Employee {
    constructor(fullName, position, salary) {
        this.fullName = fullName;
        this.position = position;
        this.salary = salary;
    }
}

class EmpTable {
    constructor(employeesArray) {
        this.employees = employeesArray;
    }

    getHtml() {
        let tableRows = '';
        for (const employee of this.employees) {
            tableRows += `
                <tr>
                    <td>${employee.fullName}</td>
                    <td>${employee.position}</td>
                    <td>${employee.salary.toFixed(2)} грн</td>
                </tr>`;
        }

        return `
            <table>
                <thead>
                    <tr>
                        <th>ПІБ</th>
                        <th>Посада</th>
                        <th>Зарплата</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>`;
    }
}

class StyledEmpTable extends EmpTable {
    getStyles() {
        return `
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                border-radius: 8px;
                overflow: hidden; /* Важливо для роботи border-radius */
            }
            th, td {
                padding: 14px 20px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            thead tr {
                background-color: #2c3e50; /* Новий колір для стилю */
                color: white;
                font-size: 16px;
            }
            tbody tr {
                background-color: #fff;
            }
            tbody tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            tbody tr:hover {
                background-color: #e9ecef;
            }
        </style>`;
    }

    getHtml() {
        const tableHtml = super.getHtml();

        const stylesHtml = this.getStyles();

        return stylesHtml + tableHtml;
    }
}

const bankEmployees = [
    new Employee('Шевченко Іван Петрович', 'Кредитний експерт', 35000),
    new Employee('Коваленко Марія Сергіївна', 'Фінансовий аналітик', 42000),
    new Employee('Бондаренко Олексій Ігорович', 'Менеджер по роботі з клієнтами', 38500),
    new Employee('Ткаченко Олена Василівна', 'Директор відділення', 75000)
];

const styledTableGenerator = new StyledEmpTable(bankEmployees);

const finalHtml = styledTableGenerator.getHtml();

const container = document.getElementById('table-container');
if (container) {
    container.innerHTML = finalHtml;
}

console.log("--- Згенерований HTML-код (разом зі стилями) ---");
console.log(finalHtml);