let project_folder = require("path").basename(__dirname);
let source_folder = "src";

let fs = require('fs');

let path = {
	build:{
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/assets/fonts/",
		lib: project_folder + "/js/lib/",
		slick: project_folder + "/lib/slick",
	},

	src: {
		html: [source_folder + "/*.html", "!"+source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/img/**/*.{gif,jpg,png,svg,ico,webp}",
		fonts: source_folder + "/fonts/*.ttf",
		lib: source_folder + "/libs/**/*",
		libsjs: source_folder + "/libs/**/*.js",
	},

	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{gif,jpg,png,svg,ico,webp}",
	},

	clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass")(require('sass')),
	webp = require("gulp-webp"),
	webphtml = require("gulp-webp-html"),
	webpcss = require("gulp-webp-css"),
	svgSprite = require("gulp-svg-sprite"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2"),
	fonter = require("gulp-fonter");

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

function html(){
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

function css(){
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(webpcss())
		.pipe(dest(path.build.css))

		// .pipe(src(path.src.libs))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function js(){
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))

		.pipe(browsersync.stream())
}

function lib(){
	return src(path.src.lib)
		.pipe(dest(path.build.lib))
}

function images(){
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70
			})
		)
		.pipe(dest(path.build.img))

		.pipe(browsersync.stream())
}

function fonts (params){
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function() { //to run: gulp otf2ttf
	return src([source_folder + '/fonts/*otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/')) 

})

gulp.task('svgSprite', function() {	 //to run: gulp svgStrite
	return gulp.src([source_folder + '/iconsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../icons/icons.svg'
				}
			}
		}
		))
		.pipe(dest(path.build.img))
} )

function	fontsStyle(params) {
	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}	
function	cb() {
}

function watchFiles (params){
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params){
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle, lib);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.lib = lib;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;