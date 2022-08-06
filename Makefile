build: clean
	@echo "🏎 => building seatajs..."
	tsc --project ./packages/seata-js/tsconfig.json

clean:
	@echo "🧹=>clean seata-js..."
	rm -rf ./packages/seata-js/lib