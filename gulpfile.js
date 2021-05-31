const {series, src, dest, watch, parallel} = require ('gulp');
// Este tiene llaves porquue queremos extraer unicamente la funcion series de la carpeta gulp
// watch: definirle un archivo que este cambiando para que lo ejecute automaticamente
const sass = require ('gulp-dart-sass');
const imagemin = require ('gulp-imagemin');
const notify = require ('gulp-notify');
const webp = require ('gulp-webp');
const concat = require ('gulp-concat');
// Este no tiene llaves porque en la carpeta gulp-dart-sass solo tiene la funcion sass, por lo que no hace falta las llaves

// UTILIDADES CSS
const autoprefixer = require ('autoprefixer');
const postcss = require ('gulp-postcss');
const cssnano = require ('cssnano');
const sourcemaps = require ('gulp-sourcemaps');

// UTILIDADES JS
const tercer = require ('gulp-terser-js');

const path = {
    imagenes: 'src/img/**/*',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
}

// Funcion que compila SASS
function css () {
    return src (path.scss)
        .pipe (sourcemaps.init())
        .pipe (sass())
        .pipe (postcss ([autoprefixer(), cssnano()]))
        .pipe (sourcemaps.write('.'))
        .pipe (dest ('./build/css'))
}
function javascript () {
    return src (path.js)
        .pipe (sourcemaps.init())
        .pipe (concat ('bundle.js'))
        .pipe (tercer())
        .pipe (sourcemaps.write('.'))
        .pipe (dest ('./build/js'))
}
function imagenes() {
    return src(path.imagenes)
        .pipe (imagemin())
        .pipe (dest('./build/img'))
        .pipe (notify({message: 'Imagen minificada'}));
        // notify nos sirve para decirle a nosotros mismos u otras personas que esta haciendo esta funcion
}
function versionWebp() {
    return src(path.imagenes)
        .pipe (webp())
        .pipe (dest ('./build/img'))
        .pipe (notify ({message: 'Versión webp lista'}));
}
function watchArchivos () {
    watch (path.scss, css); // * = la carpeta actual - ** = Todos los archivos con esa extension
    watch (path.js, javascript);
}

exports.css = css;
// Recomendacion: Llamala con el mismo nombre que la funcion, para no confundirse
exports.imagenes = imagenes;
exports.watchArchivos = watchArchivos;

exports.default = series(css, javascript, imagenes, versionWebp, watchArchivos);