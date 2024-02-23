#!/bin/sh

CMD_MYSQL="mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE}"

# Users
$CMD_MYSQL -e "create table ${MYSQL_USERS_TABLE} (
    ${MYSQL_USERS_ID} varchar(32) NOT NULL,
    ${MYSQL_USERS_PASSWORD} varchar(64) NOT NULL,
    ${MYSQL_CREATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ${MYSQL_UPDATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (${MYSQL_USERS_ID})
);"

# Day Records
$CMD_MYSQL -e "create table ${MYSQL_DAY_RECORD_TABLE} (
    ${MYSQL_DAY_RECORD_ID} int(16) AUTO_INCREMENT,
    ${MYSQL_USERS_ID} varchar(32) NOT NULL,
    ${MYSQL_DAY_RECORD_DATE} DATETIME NOT NULL,
    ${MYSQL_DAY_RECORD_HAPPINESS} int(16) NOT NULL,
    ${MYSQL_CREATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ${MYSQL_UPDATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (${MYSQL_DAY_RECORD_ID}),
    UNIQUE (${MYSQL_USERS_ID}, ${MYSQL_DAY_RECORD_DATE}),
    FOREIGN KEY (${MYSQL_USERS_ID}) REFERENCES ${MYSQL_USERS_TABLE}(${MYSQL_USERS_ID})
);"

# Time Records
$CMD_MYSQL -e "create table ${MYSQL_TIME_RECORD_TABLE} (
    ${MYSQL_TIME_RECORD_ID} int(16) AUTO_INCREMENT,
    ${MYSQL_USERS_ID} varchar(32) NOT NULL,
    ${MYSQL_TIME_RECORD_START_TIME} DATETIME NOT NULL,
    ${MYSQL_TIME_RECORD_INVESTMENT_MONEY} int(64) NOT NULL,
    ${MYSQL_TIME_RECORD_RECOVERY_MONEY} int(64) NOT NULL,
    ${MYSQL_CREATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ${MYSQL_UPDATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (${MYSQL_TIME_RECORD_ID}),
    FOREIGN KEY (${MYSQL_USERS_ID}) REFERENCES ${MYSQL_USERS_TABLE}(${MYSQL_USERS_ID})
);"

# Machine 
$CMD_MYSQL -e "create table ${MYSQL_MACHINE_TABLE} (
    ${MYSQL_MACHINE_ID} int(16) AUTO_INCREMENT,
    ${MYSQL_MACHINE_NAME} varchar(64) NOT NULL,
    ${MYSQL_MACHINE_RATE} int(16) NOT NULL,
    ${MYSQL_CREATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ${MYSQL_UPDATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (${MYSQL_MACHINE_ID})
);"

# RPM Records
$CMD_MYSQL -e "create table ${MYSQL_RPM_RECORD_TABLE} (
    ${MYSQL_RPM_RECORD_ID} int(16) AUTO_INCREMENT,
    ${MYSQL_TIME_RECORD_ID} int(16) NOT NULL,
    ${MYSQL_RPM_RECORD_INVESTMENT_MONEY} int(64) NOT NULL,
    ${MYSQL_RPM_RECORD_INVESTMENT_BALL} int(64) NOT NULL,
    ${MYSQL_RPM_RECORD_START_RPM} int(64) NOT NULL,
    ${MYSQL_RPM_RECORD_END_RPM} int(64) NOT NULL,
    ${MYSQL_MACHINE_ID} int(16) NOT NULL,
    ${MYSQL_CREATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ${MYSQL_UPDATEDAT} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (${MYSQL_RPM_RECORD_ID}),
    FOREIGN KEY (${MYSQL_TIME_RECORD_ID}) REFERENCES ${MYSQL_TIME_RECORD_TABLE}(${MYSQL_TIME_RECORD_ID}),
    FOREIGN KEY (${MYSQL_MACHINE_ID}) REFERENCES ${MYSQL_MACHINE_TABLE}(${MYSQL_MACHINE_ID})
);"
