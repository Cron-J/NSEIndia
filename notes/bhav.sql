-- Table: bhav

-- DROP TABLE bhav;

CREATE TABLE bhav
(
INSTRUMENT	varchar,
SYMBOL	varchar(20),
EXPIRY_DT	date,
STRIKE_PR	money,
OPTION_TYP	char(2),
OPEN	money,
HIGH	money,
LOW	money,
CLOSE	money,
SETTLE_PR	money,
CONTRACTS	money,
VAL_INLAKH	money,
OPEN_INT	money,
CHG_IN_OI	money,
TIMESTAMP	date
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bhav
  OWNER TO postgres;


COPY bhav FROM '/Users/Shared/fo07OCT2015bhav.csv' CSV HEADER