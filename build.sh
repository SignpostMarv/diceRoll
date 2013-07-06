DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${DIR}
if command -v doxygen 2>/dev/null ; then
	if [ -d "./docs/" ]; then
		rm -fr "./docs/*";
	fi
	doxygen Doxyfile
fi
if [ -f "../compiler.jar" ]; then
	if [ ! -d "./build/" ]; then
		mkdir -p "./build/" ;
	fi
	java -jar "../compiler.jar" --js "./js/diceRoll.js" --js_output_file "./build/diceRoll.min.js" --create_source_map "./build/diceRoll.min.js.map" --compilation_level ADVANCED_OPTIMIZATIONS --language_in=ECMASCRIPT5_STRICT --warning_level VERBOSE 2> "./compiler.error.log"
	if [ -s "./compiler.error.log" ]; then
		echo "closure compiler has errors!" 1>&2;
		exit 1;
	fi
	if [ -f "../7za.exe" ]; then
		if [ -f "./build/diceRoll.min.js.gz" ]; then
			rm "./build/diceRoll.min.js.gz";
		fi
		if [ -f "./build/diceRoll.min.js.map.gz" ]; then
			rm "./build/diceRoll.min.js.map.gz";
		fi
		../7za.exe a -tgzip "./build/diceRoll.min.js.gz" "./build/diceRoll.min.js" -mx=9 -mfb=258 -mpass=15
		../7za.exe a -tgzip "./build/diceRoll.min.js.map.gz" "./build/diceRoll.min.js.map" -mx=9 -mfb=258 -mpass=15
	else
		gzip -cf --best "./build/diceRoll.min.js" > "./build/diceRoll.min.js.gz"
		gzip -cf --best "./build/diceRoll.min.js.map" > "./build/diceRoll.min.js.map.gz"
	fi
fi