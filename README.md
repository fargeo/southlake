# South Lake Tahoe hack trip package

## options
```
-db : run setup_py to rebuild your database
-ow : overwrite concepts and collections 
-st : stage concepts and collections
-s  : a zipfile located on github or locally
```
## configuration
By default mapbox-style layers will be loaded with the name property found in the layer's style.json file. The default name for tile server layers will be the basename of the layer's xml file. For both mapbox-style and tile server layers the default icon-class will be `fa fa-globe`. To customize the name and icon-class, simply add a meta.json file to the layer's directory with the following object:

```
{
  "name": "example name",
  "icon": "fa example-class"
}
```

## load data
To load data the target must be an arches project rather than the arches application:

```
arches-project create sltproject
cd sltproject
python manage.py packages -o load_package -s https://github.com/fargeo/southlake/archive/master.zip -db true
```
