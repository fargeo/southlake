ALTER TABLE parcels 
   ALTER COLUMN geom 
   TYPE Geometry(MULTIPOLYGON, 900913) 
   USING ST_Transform(geom, 900913);

ANALYZE "public"."parcels";

ALTER TABLE streets
   ALTER COLUMN geom 
   TYPE Geometry(MULTILINESTRING, 900913) 
   USING ST_Transform(geom, 900913);

ANALYZE "public"."streets";
