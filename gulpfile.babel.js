import { series, parallel, dest, src, watch } from "gulp"
import del from "del"
import concat from "gulp-concat"
import pug from "gulp-pug"
import plumber from "gulp-plumber"
import cssnano from "cssnano"
import sass from "gulp-sass"
import postcss from "gulp-postcss"
import cssSort from "css-declaration-sorter"
import autoprefixer from "autoprefixer"
import uglify from "gulp-uglify"
import sourcemap from "gulp-sourcemaps"
import uglifyBabel from "gulp-terser"
import babel from "gulp-babel"
import rename from "gulp-rename"
import sync from "browser-sync"
import { readFileSync } from "graceful-fs"

export const cleanDist = () => {
    return del("dist")
}
export const cleanImages = () => {
    return del("dist/img")
}

export const images = () => {
    return src(['./src/img/**/*.{svg,gif,png,jpg,jpeg}', './src/img/*.{svg,gif,png,jpg,jpeg}'])
        .pipe(dest("dist/img"))
}
export const favicon = () => {
    return src(['./src/favicon/**/*', './src/favicon/*'])
        .pipe(dest("dist/favicon"))
}

export const fonts = () => {
    let url = JSON.parse(readFileSync("config.json"))
    return src(url.font, {
        allowEmpty: true
    })
        .pipe(dest("dist/fonts"))
}

export const cssCore = () => {
    let url = JSON.parse(readFileSync("config.json"))
    return src(url.css, {
        allowEmpty: true
    })
        .pipe(plumber())
        .pipe(concat("core.min.css"))
        .pipe(postcss([
            autoprefixer({
                browsers: ["last 4 version", "IE 9"],
                cascade: false
            }),
            cssnano(),
            cssSort({
                order: "concentric-css",
            })
        ]))
        .pipe(dest("dist/css"))
}

export const jsCore = () => {
    let url = JSON.parse(readFileSync("config.json"))
    return src(url.js, {
        allowEmpty: true
    })
        .pipe(plumber())
        .pipe(concat("core.min.js"))
        .pipe(uglify())
        .pipe(dest("dist/js"))
}

export const styles = () => {
    return src(["./src/components/_core/**.sass", "./src/components/**/**.sass"])
        .pipe(sourcemap.init())
        .pipe(concat("main.min.sass"))
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([
            autoprefixer({
                browsers: ["last 4 version", "IE 9"],
                cascade: false
            }),
            cssnano(),
            cssSort({
                order: "concentric-css",
            })
        ]))
        .pipe(sourcemap.write("."))
        .pipe(dest("dist/css"))
}

export const templates = () => {
    return src([
        "src/pages/*.pug",
        "!src/pages/\_*.pug"
    ])
        .pipe(plumber())
        .pipe(pug({
            pretty: "\t",

        }))
        .pipe(dest("dist"))
}
export const scripts = () => {
    return src("src/js/main.js")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(uglifyBabel())
        .pipe(rename("main.min.js"))
        .pipe(sourcemap.write("."))
        .pipe(dest("dist/js"))
}
export const server = () => {
    sync.init({
        notify: true,
        server: {
            baseDir: "dist",
        },
        port: 9999
    })

    watch([
        "src/js/*.js"
    ], series(scripts));

    watch([
        "src/**/**.pug"
    ], series(templates));

    watch([
        "src/components/**/**.sass"
    ], series(styles));

    watch([
        "src/img/**/**.{svg,png,jpg,speg,gif}"
    ], series(cleanImages, images));

    watch([
        "src/plugins/**/**.css", "src/plugins/**/**.js", "config.json"
    ], parallel(jsCore, cssCore));

    watch([
        "dist"
    ]).on("change", sync.reload);
}

exports.default = series(
    cleanDist,
    parallel(
        images,
        fonts,
        favicon
    ),
    parallel(
        cssCore,
        jsCore
    ),
    styles,
    templates,
    scripts,
    server
)
exports.build = series(
    cleanDist,
    parallel(
        images,
        fonts,
        favicon
    ),
    parallel(
        cssCore,
        jsCore
    ),
    styles,
    templates,
    scripts,
)