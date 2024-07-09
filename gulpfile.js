const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");



function compilarSCSS(done){ //Done es un callback que se manda a llamara para saber si ya se terminó la tarea

    //Paso 1: Identificar Archivo
    src("src/scss/app.scss") //Se coloca la ruta del archivo
        .pipe( sourcemaps.init() ) //Inicia el sourcemaps
        .pipe( sass() )  //Paso 2: Compilarlo
        .pipe( postcss( [ autoprefixer(), cssnano() ] ) ) //Agrega el autoprefixer
        .pipe( sourcemaps.write(".") ) //Se graba el sourcemaps
        .pipe( dest("build/css") ); //Paso 3: Cuardar el .css, Se coloca la ruto doncde se quiere guardar

    done(); //Se indica que se terminó la tarea
} //Se crear la tarea

function imagenes( done ){
    src("src/img/**/*") /* Identifica las imagenes */
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe(dest("build/img"));

    done();
}

function versionWebp(){
    return src("src/img/**/*.{png,jpg}")
        .pipe(webp())
        .pipe(dest("build/img"));
}

function versionAvif(){
    return src("src/img/**/*.{png,jpg}")
        .pipe(avif())
        .pipe(dest("build/img"));
}


function dev(){
    watch("src/scss/**/*.scss", compilarSCSS); //Le decimos que este atento a todos los archivos .scss
    watch("src/scss/app.scss", compilarSCSS); //Le decimos que este atento a este archivo
                               //Indicamos que se ejecute la función una vez que se detecte un cambio
    watch("src/img/**/*", imagenes);
}

exports.compilarSCSS = compilarSCSS; //Se export para que se pueda utilizar

exports.dev = dev;

exports.imagenes = imagenes;

exports.versionWebp = versionWebp;

exports.versionAvif = versionAvif;

//series - Se inicia una tarea, y hasra que finaliza inicia la siguiente tarea

exports.default = series(imagenes, versionWebp, versionAvif, compilarSCSS, dev);

//parallel - Todas inician al mismo tiempo


