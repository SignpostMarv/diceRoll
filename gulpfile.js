const gulp = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const typedoc = require('gulp-typedoc');

const typescript_tasks = [];

const create_typescript_task = (subdirectory, config = {}) => {
	const task_name = 'ts' + (typescript_tasks.length + 1);

	gulp.task(task_name, () => {
		return gulp.src('./ts/**/*.ts').pipe(
			sourcemaps.init()
		).pipe(typescript.createProject('tsconfig.json', config)()).pipe(
			replace(/\ {4}/g, '\t')
		).pipe(
			sourcemaps.write('./')
		).pipe(gulp.dest(subdirectory));
	});

	typescript_tasks.push(task_name);
};

create_typescript_task('./js/');

gulp.task('typescript', gulp.parallel(...typescript_tasks));
gulp.task('docs', () => {
	return gulp.src('./ts/**/*.ts').pipe(typedoc({
		module: 'esnext',
		out: './docs/',
		theme: 'minimal',
	}));
});

gulp.task('default', gulp.parallel(
	'typescript',
	'docs'
));
