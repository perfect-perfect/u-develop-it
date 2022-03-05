-- 
-- basically anytime we want to create a table we create a matching DROP TABLE
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS voters;

-- it told us explicitly to create this parties table above where we created the candidates table
CREATE TABLE parties (
    id  INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);
    -- TEXT is a datatype
    --  - similar to VARCHAR but doesn't have a character limitatuon

CREATE TABLE candidates (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    party_id INTEGER,
    industry_connected BOOLEAN NOT NULL,
    -- Constraint - sets constraint
    -- fk_party - I am not sure what this does
    -- FOREGIN KEY (party_id) - (party_id) is the name of the field in the primary table
    -- REFERENCES parties(party_id) - tells you what the name of the foerign key field is in its native table
    -- ON DELETE SET NULL - makes it so if you delete the the id we are referncing it would set the value to null in our primary table
    CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);

-- create the voters table
CREATE TABLE voters (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    -- with DEFAULT, you can specify what the vallue should be if no value is provided
    -- We are specifying CURRENT_TIMESTAMP as the value for DEFAULT
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- create votes table
CREATE TABLE votes (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    voter_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uc_voter UNIQUE (voter_id),
    CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
    CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);