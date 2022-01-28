
DELIMITER $
BEGIN NOT ATOMIC
    IF NOT EXISTS (SELECT *
FROM information_schema.tables
WHERE table_schema = 'seminar_instance' 
    AND table_name = 'Orders'
LIMIT 1) THEN 
   CREATE TABLE Orders (
	OrderId INT NOT NULL AUTO_INCREMENT,
	Title VARCHAR(20),
	Quantity DECIMAL (18,2),
	Message CHAR(255),
	City CHAR(30),
	PRIMARY KEY (OrderId)
);
    END IF;
END $
DELIMITER ;

DELIMITER $
BEGIN NOT ATOMIC
    IF NOT EXISTS (SELECT *
FROM information_schema.tables
WHERE table_schema = 'seminar_instance' 
    AND table_name = 'Products'
LIMIT 1) THEN 
	CREATE TABLE Products (
	ProductId INT NOT NULL AUTO_INCREMENT,
	Name VARCHAR(20),
	Price DECIMAL(18, 2),
	OrderId INT NOT NULL,
	PRIMARY KEY (ProductId),
	CONSTRAINT FK_OrderId_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
	);
    END IF;
END $
DELIMITER ;
