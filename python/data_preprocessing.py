
import mysql.connector
import csv


# CONNECT TO MYSQL DATABASE
def connect_database():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Brindha_7310",
            database="employee_payroll"
        )

        print("Database connected successfully!")
        return connection

    except mysql.connector.Error as error:
        print("Database connection failed:", error)
        return None


# RETRIEVE EMPLOYEE DATA
def get_employee_data(connection):
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT employee_id AS id, name, department, salary
        FROM employees
    """)

    employees = cursor.fetchall()
    cursor.close()

    return employees


# RETRIEVE ATTENDANCE DATA
def get_attendance_data(connection):
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT id,
               employee_id,
               employee_name,
               attendance_date AS date,
               status
        FROM attendance_records
    """)

    attendance = cursor.fetchall()
    cursor.close()

    return attendance


# PREPROCESS EMPLOYEE DATA
def preprocess_employees(employees):
    cleaned = []
    seen_ids = set()

    for employee in employees:
        employee_id = employee["id"]
        name = employee["name"]

        if employee_id is None or not name:
            continue

        if employee_id in seen_ids:
            continue

        try:
            salary = float(employee["salary"])
        except (ValueError, TypeError):
            continue

        if salary < 0:
            continue

        employee["salary"] = salary
        cleaned.append(employee)
        seen_ids.add(employee_id)

    return cleaned


# PREPROCESS ATTENDANCE DATA
def preprocess_attendance(attendance):
    cleaned = []
    seen_ids = set()

    for record in attendance:
        record_id = record["id"]
        employee_id = record["employee_id"]
        date = record["date"]
        status = str(record["status"]).strip().title()

        if record_id is None or employee_id is None:
            continue

        if date is None or status not in ["Present", "Absent"]:
            continue

        if record_id in seen_ids:
            continue

        record["date"] = str(date)
        record["status"] = status

        cleaned.append(record)
        seen_ids.add(record_id)

    return cleaned


# SAVE DATA AS CSV
def save_csv(filename, records, columns):
    with open(filename, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=columns)
        writer.writeheader()
        writer.writerows(records)


# MAIN FUNCTION
def main():
    connection = connect_database()

    if connection is None:
        return

    try:
        employees = get_employee_data(connection)
        attendance = get_attendance_data(connection)

        print("\nOriginal Employees:", len(employees))
        print("Original Attendance Records:", len(attendance))

        employees = preprocess_employees(employees)
        attendance = preprocess_attendance(attendance)

        print("\nCleaned Employees:", len(employees))
        print("Cleaned Attendance Records:", len(attendance))

        save_csv(
            "cleaned_employees.csv",
            employees,
            ["id", "name", "department", "salary"]
        )

        save_csv(
            "cleaned_attendance.csv",
            attendance,
            ["id", "employee_id", "employee_name", "date", "status"]
        )

        print("\nPreprocessing completed successfully!")
        print("CSV files generated successfully.")

    except Exception as error:
        print("Processing error:", error)

    finally:
        connection.close()
        print("\nDatabase connection closed.")


if __name__ == "__main__":
    main()
