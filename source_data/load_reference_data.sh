createdb -U postgres sltreference
psql -U postgres -d sltreference -f setup_reference_db.sql
psql -U postgres -d sltreference -f parcels_1.sql
psql -U postgres -d sltreference -f parcels_2.sql
psql -U postgres -d sltreference -f parcels_3.sql
psql -U postgres -d sltreference -f parcels_4.sql
psql -U postgres -d sltreference -f parcels_5.sql
psql -U postgres -d sltreference -f streets.sql
psql -U postgres -d sltreference -f update_srids.sql
