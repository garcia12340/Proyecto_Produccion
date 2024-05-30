CREATE TABLE MantenimientoCorrectivo(
	IdMantenimiento int primary key identity(1,1),
	HorasKilometradas int NOT NULL,
	MTBF int NOT NULL,
	MTBFValor int NOT NULL,
	DuracionTarea int NOT NULL,
	CostoHoraTrabajo int NOT NULL,
	Respuestos int NOT NULL,
	CostoTareasOperacionales int NOT NULL,
	RetrasoLogistico int NOT NULL,
	CostoUnitarioParada int NOT NULL,
	CostoFallaUnica int NOT NULL,
	Analisis varchar(200)
)

-----------------SP MANTENIMIENTO CORRECTIVO-----------------
CREATE PROC MostrarCorrectivo
AS 
BEGIN
	SELECT 	IdMantenimiento,
			HorasKilometradas,
			MTBF,
			MTBFValor,
			DuracionTarea,
			CostoHoraTrabajo,
			Respuestos,
			CostoTareasOperacionales,
			RetrasoLogistico,
			CostoUnitarioParada,
			CostoFallaUnica,
			Analisis
		FROM MantenimientoCorrectivo
		ORDER BY IdMantenimiento DESC
	END
GO
EXEC MostrarCorrectivo  

CREATE TABLE CantidadPedido(
	IdCantidadPedido int primary key identity(1,1),
	Demanda int NOT NULL,
	costoOrden int NOT NULL,
	costoMantenimiento int NOT NULL,
	Eoq int NOT NULL,
	Analisis varchar(200)
)

-----------------SP CANTIDAD ECONOMICA DE PEDIDOS-----------------
CREATE PROC MostrarCantidadPedido
AS
BEGIN
	SELECT  IdCantidadPedido,
			Demanda,
			costoOrden,
			costoMantenimiento,
			Eoq,
			Analisis
		FROM CantidadPedido
		ORDER BY IdCantidadPedido DESC
	END
GO

CREATE TABLE CostoFijoPieza(
	IdCostoFijoPieza int primary key identity(1,1),
	Demanda int NOT NULL,
	MetodoPedido varchar(14),
	cantidadPedido int NOT NULL,
	stockSeguridad int NOT NULL,
	Resultado varchar(200)
)

-----------------SP MANTENIMIENTO CORRECTIVO-----------------
CREATE PROC MostrarCostoFijoPieza
AS
BEGIN
	SELECT  IdCostoFijoPieza,
			Demanda,
			MetodoPedido,
			cantidadPedido,
			stockSeguridad,
			Resultado
		FROM CostoFijoPieza
		ORDER BY IdCostoFijoPieza DESC
	END
GO

CREATE TABLE CostoPromedioPieza(
	IdCostoPromedioPieza int primary key identity(1,1),
	Demanda int NOT NULL,
	cicloRevisionSemanas int NOT NULL,
	inventarioSeguridad int NOT NULL,
	Analisis varchar(200)
)

-----------------SP COSTO FIJO POR PIEZA-----------------
CREATE PROC MostrarCostoPromedioPieza
AS
BEGIN
	SELECT  IdCostoPromedioPieza,
			Demanda,
			cicloRevisionSemanas,
			inventarioSeguridad,
			Analisis
		FROM CostoPromedioPieza
		ORDER BY IdCostoPromedioPieza DESC
	END
GO