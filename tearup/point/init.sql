DROP DATABASE IF EXISTS point;
CREATE DATABASE IF NOT EXISTS point CHARACTER SET utf8 COLLATE utf8_general_ci;
USE point;

CREATE TABLE organizations (
    id BIGINT AUTO_INCREMENT,
    name varchar(255),
    created timestamp DEFAULT current_timestamp,
    updated timestamp DEFAULT current_timestamp ON UPDATE current_timestamp,
    PRIMARY KEY (id)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

INSERT INTO organizations (name) VALUES ("sck-online-store");

CREATE TABLE points (
    id BIGINT AUTO_INCREMENT,
    org_id BIGINT,
    user_id int,
    amount int,
    created timestamp DEFAULT current_timestamp,
    updated timestamp DEFAULT current_timestamp ON UPDATE current_timestamp,
    PRIMARY KEY (id),
    FOREIGN KEY (org_id) REFERENCES organizations(id)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

-- New Point Database Design tables:
CREATE TABLE point_wallet (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    balance INT DEFAULT 0 COMMENT 'Cached active balance',
    PRIMARY KEY (id)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE price_table (
    id BIGINT AUTO_INCREMENT,
    min_order_amount DECIMAL(10,2) NOT NULL,
    max_order_amount DECIMAL(10,2) NOT NULL,
    points_awarded INT NOT NULL,
    PRIMARY KEY (id)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE order_point (
    id BIGINT AUTO_INCREMENT,
    wallet_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    points_earned INT NOT NULL,
    points_remaining INT NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'SPENT', 'EXPIRED', 'VOID') DEFAULT 'PENDING',
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (wallet_id) REFERENCES point_wallet(id)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE point_spend_allocation (
    id BIGINT AUTO_INCREMENT,
    order_point_id BIGINT NOT NULL,
    spend_order_id BIGINT NOT NULL,
    points_used INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order_point_id) REFERENCES order_point(id)
) CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE point_transaction (
    id BIGINT AUTO_INCREMENT,
    wallet_id BIGINT NOT NULL,
    order_point_id BIGINT NULL,
    type ENUM('EARN', 'SPEND', 'EXPIRE', 'VOID', 'APPROVE') NOT NULL,
    amount INT NOT NULL,
    balance_after INT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (wallet_id) REFERENCES point_wallet(id),
    FOREIGN KEY (order_point_id) REFERENCES order_point(id)
) CHARACTER SET utf8 COLLATE utf8_general_ci;
