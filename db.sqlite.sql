CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM ('admin', 'doctor', 'patient') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    gender ENUM ('Male', 'Female'),
    date_of_birth DATE,
    district VARCHAR(50),
    blood_group VARCHAR(10),
    emergency_contact VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
CREATE TABLE clinics (
    clinic_id INT PRIMARY KEY AUTO_INCREMENT,
    clinic_name VARCHAR(150) NOT NULL,
    district VARCHAR(50),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    opening_hours VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100)
);
CREATE TABLE clinic_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clinic_id INT,
    service_id INT,
    FOREIGN KEY (clinic_id) REFERENCES clinics (clinic_id),
    FOREIGN KEY (service_id) REFERENCES services (service_id)
);
CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    clinic_id INT,
    appointment_date DATETIME,
    reason TEXT,
    status ENUM (
        'Pending',
        'Approved',
        'Completed',
        'Cancelled'
    ) DEFAULT 'Pending',
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id),
    FOREIGN KEY (clinic_id) REFERENCES clinics (clinic_id)
);
CREATE TABLE health_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    alert_type ENUM (
        'Info',
        'Warning',
        'Emergency'
    ),
    district VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status ENUM ('Active', 'Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO
    health_alerts (
        title,
        description,
        alert_type,
        district
    )
VALUES (
        'Malaria Prevention Campaign',
        'Free bed net distribution ongoing.',
        'Info',
        'Bo'
    ),
    (
        'Cholera Advisory',
        'Drink only treated water.',
        'Warning',
        'Waterloo'
    );
CREATE TABLE emergency_contacts (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    organization_name VARCHAR(150),
    phone VARCHAR(20),
    district VARCHAR(50),
    description TEXT
);
INSERT INTO
    emergency_contacts (organization_name, phone)
VALUES (
        'National Health Hotline',
        '117'
    );

INSERT INTO
    emergency_contacts (organization_name, phone)
VALUES (
        'National Health Hotline',
        '117'
    );
CREATE TABLE contact_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE alert_subscribers (
    subscriber_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE,
    district VARCHAR(50),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);