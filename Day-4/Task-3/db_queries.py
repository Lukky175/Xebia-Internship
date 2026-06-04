def get_monthly_attendance(conn, employee_id, month, year):
    query = """
        SELECT a.date, a.check_in, a.check_out, e.name
        FROM attendance a

        -- Fix-1: Changed to 'INNER JOIN' to only return data of matching employees.
        INNER JOIN employees e
        ON a.employee_id = e.id

        WHERE a.month = ?
        AND a.year = ?

        -- Fix-2: Added employee_id filter helps in 'Filter records' for specified employee.
        AND a.employee_id = ?

        ORDER BY a.date ASC
    """

    cursor = conn.cursor()

    cursor.execute(query, (month, year, employee_id))     # Fix-3: Add new Parameter 'employee_id' to match the added filter.

    return cursor.fetchall()