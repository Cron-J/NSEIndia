-- Table: bhav

-- DROP TABLE bhav;

CREATE TABLE bhav
(
INSTRUMENT	varchar,
SYMBOL	varchar(20),
EXPIRY_DT	date,
STRIKE_PR	real,
OPTION_TYP	char(2),
OPEN	real,
HIGH	real,
LOW	real,
CLOSE	real,
SETTLE_PR	real,
CONTRACTS	real,
VAL_INLAKH	real,
OPEN_INT	real,
CHG_IN_OI	real,
TIMESTAMP	date,
none char(1)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bhav
  OWNER TO postgres;


COPY bhav FROM '/Users/Shared/fo07OCT2015bhav.csv' CSV HEADER