angular.module('starter.provider', [])

.provider();

angular.module('services', [])
	.provider('couchbase', function () {
		var dbName,
			devUrl;

		function Couchbase($http) {
			var url,
				db,
				getConnectionString = function () {
					return url + db + '/';
				};
			this.get = function (key) {
				return $http.get(getConnectionString() + key);
			};
			this.post = function (key, objectToPut) {
				return $http.post(getConnectionString() + key, objectToPut);
			};
			this.put = function (key, objectToPut) {
				return $http.put(getConnectionString() + key, objectToPut);
			};
			this.delete = function (key) {
				return $http.delete(getConnectionString() + key);
			};
			this.getUrl = function () {
				return url;
			};
			this.setUrl = function (value) {
				url = value;
			};
			this.getDbName = function () {
				return url;
			};
			this.setDbName = function (value) {
				db = value;
			};
			this.createDb = function () {
				return $http.put(url + db);
			}
		};

		this.setDevUrl = function (value) {
			devUrl = value;
		}

		this.setDbName = function (value) {
			dbName = value;
		};
		this.$get = ['$window', '$http', '$timeout', function ($window, $http, $timeout) {
			var couchbase = new Couchbase($http);

			$timeout(function () {
				if ($window.cblite) {
					$window.cblite.getURL(
						function (err, url) {
							if (err) {
								couchbase.setUrl(err);
							} else {
								couchbase.setUrl(url);
							}

							couchbase.setDbName(dbName)
							couchbase.createDb();
						});
				} else {
					couchbase.setUrl(devUrl);
					couchbase.setDbName(dbName);
					couchbase.createDb();
				}


				/*
				// Init Couch DB
	var coax = require('coax'),
		appDbName = 'sms';

	function setupDb(db, cb) {
		db.get(function (err, res, body) {
			$log.log(JSON.stringify(['before create db put', err, res, body]))
			db.put(function (err, res, body) {
				db.get(cb)
			})
		})
	};

	function setupViews(db, cb) {
		var design = '_design/expenseTrackNew'
		db.put(design, {
			views: {
				expenseTrackListsNew: {
					map: function (doc) {
						if (doc.trackType == 'expense' && doc.date && doc.merchant && doc.amount) {
							emit([doc.date.year, doc.date.month, doc.date.date], doc);
						}
					}.toString()
				},
				expenseTrackByAccount: {
					map: function (doc) {
						emit([doc.account, doc.merchant], {
							account: doc.account,
							merchant: doc.merchant,
							amount: doc.amount.value,
							currency: doc.amount.currency
						});
					}.toString(),
					reduce: function (keys, values, rereduce) {
						var response = {
							'account': 0,
							'merchant': 0,
							'sum': 0
						};
						for (i = 0; i < values.length; i++) {
							response.sum = response.sum + values[i].amount;
							response.merchant = values[i].merchant;
							response.account = values[i].account;
						}
						return response;
					}.toString()
				},
				expenseTrackByDate: {
					map: function (doc) {
						emit([doc.date.year, doc.date.month, doc.date.date], doc);
					}.toString(),
					reduce: function (keys, values, rereduce) {
						var response = {
							'totalExpenses': 0
						};
						for (i = 0; i < values.length; i++) {
							response.totalExpenses = response.totalExpenses + values[i].amount.value;
							response.year = values[i].date.year;
							response.month = values[i].date.month;
							response.date = values[i].date.date;
						}
						return response;
					}.toString()
				},
				expenseBillRemainder: {
					map: function (doc) {
						if (doc.trackType == 'remainder' && doc.dueDate && doc.dueDate.year && doc.dueDate.month && doc.dueDate.date) {
							emit([doc.dueDate.year, doc.dueDate.month, doc.dueDate.date], doc);
						}
					}.toString(),
				}
			}
		}, function () {
			cb(false, db([design, '_view']))
		})
	}
	if (!_.isUndefined(cblite)) {
		cblite.getURL(function (err, url) {
			if (err) {
				$log.log('db not initialized');
			} else {
				window.server = coax(url);
				var db = coax([url, appDbName]);
				var setUpDbCb = function (err, info) {
					if (err) {
						$log.log('err', err, info);
					} else {
						setupViews(db, function (err, views) {
							if (err) {
								$log.log('err views', err)
							} else {
								$log.log('views success');
								window.config = {
									db: db,
									s: coax(url),
									views: views
								};

								return config;
							}
						});
					}
				};
				setupDb(db, setUpDbCb);
			}
		});
	} else {
		$log.log('cblite not intilized');
	}

	function insertTranData(smsData) {
		if (smsReader) {
			var smsData = {
				//sender : smsData.address,
				//msg: smsData.body
				sender: 'AM-ICICIB',
				msg: 'Dear Customer, You have made a Debit Card purchase of INR300.00 on 15 Jul. Info.VPS*MADHUS SERV. Your Net Available Balance is INR XXXXX.'
			}
			smsReader.parse(smsData, function (transactionData) {
				debugger;
				transactionData.trackType = 'expense';
				config.db.post(transactionData, function (err, ok) {
					$log.log('inserted successfully > ', arguments);
				});
			}, function (e) {
				$log.log('error while parse ', e);
			});
		} else {
			$log.log('smsReader not intilized ');
		}
	}
	if ( ! _.isUndefined(navigator.smsrec)) {
		$log.log('sms Plugin intilized');
		navigator.smsrec.startReception(function (data) {
			insertTranData(data)
		}, function (err) {
			$log.log(err)
		});
	} else {
		$log.log('sms Plugin not intilized');
	}
				*/


			}, 100);

			return couchbase;
	}];
	})
	.factory('apiServices', ['$http', '$timeout', '$q', '$log', '$timeout', apiServicesFn]);

function apiServicesFn($http, $timer, $q, $log, $timeout) {
	$log.log('apiService initialized!');

	function timeSince(date) {
		var seconds = Math.floor((new Date() - new Date(date.value)) / 1000);
		if(_.isNumber(seconds)) {
			var interval = Math.floor(seconds / (365 * 24 * 60 * 60));
			if (interval > 0) {
				return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
			}
			interval = Math.floor(seconds / (30 * 24 * 60 * 60));
			if (interval > 0) {
				return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
			}
			interval = Math.floor(seconds / (24 * 60 * 60));
			if (interval > 0) {
				return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
			}
			interval = Math.floor(seconds / (60 * 60));
			if (interval > 0) {
				return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';
			}
			interval = Math.floor(seconds / 60);
			if (interval > 0) {
				return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago';
			}
			return Math.floor(seconds) + ' second' + (interval > 1 ? 's' : '') + ' ago';
		}
		$log.log('Error preparing timeSince: data.value: ', date.value);
		return '';
	}
	var getExpensesGraphData = function () {
		var data = [];
		var deferred = $q.defer();
		if (window.config) {
			config.db(['_design/expenseTrackNew', '_view'])(['expenseTrackByDate', {
				group_level: 2
			}], function (err, response) {
				if (err) {
					$log.log('Error while querying DB', err);
					deferred.reject(err);
				} else {
					var rows = _.has(response, 'rows') ? response.rows : [];
					var cDate = new Date();
					var cYear = cDate.getFullYear();
					var cMonth = cDate.getMonth() + 1;
					var retMonArr = [];
					for (i = 6; i > 0; i--) {
						if (cMonth < 6) {
							retMonArr.push({
								y: cMonth - i < 0 ? cYear - 1 : cYear,
								m: cMonth - i < 0 ? 12 + (cMonth + 1 - i) : cMonth + 1 - i
							});
						} else {
							retMonArr.push({
								y: cYear,
								m: cMonth + 1 - i
							});
						}
					}
					_.each(retMonArr, function (v, i) {
						var expYear = v.y;
						var expMonth = v.m;
						var hasData = 0;
						_.every(rows, function (row, i) {
							var key = _.has(row, 'key') ? row.key : [];
							var value = _.has(row, 'value') ? row.value : {};
							if (key.length > 0 && key[0] === expYear) {
								var month = _.has(value, 'month') ? value.month : null;
								var totalExpenses = _.has(value, 'totalExpenses') ? value.totalExpenses : null;
								if (expMonth === month) {
									hasData = !0;
									data.push({
										selected: cMonth === month,
										expenses: totalExpenses,
										month: dateutil.format(new Date(cYear, month, 1), 'M')
									});
									return false;
								}
							}
							return true;
						});
						if (!hasData) {
							data.push({
								selected: cMonth === expMonth,
								expenses: 0,
								month: dateutil.format(new Date(expYear, expMonth, 1), 'M')
							});
						}
					});
					deferred.resolve({
						data: data
					});
				}
			});
		} else {
			$log.log('window.config not available');
			deferred.reject('window.config not available');
		}
		/*$http.get('js/app/expenses/expenses.json')
			.success(function (response) {
				$log.log('Expenses Data', response);

				deferred.resolve({
					data: response
				});
			})
			.error(function (error) {
				$log.log('Expenses Error', error);
				deferred.reject(error);
			});*/
		return deferred.promise;
	};
	var getExpensesListData = function () {
		var recentSpends = [],
			bills = [],
			spendsByAccounts = [];
		var byRecent = false,
			byBills = false,
			byAcc = false;
		var deferred = $q.defer();
		if (window.config) {
			// Recent Spends
			config.db(['_design/expenseTrackNew', '_view'])(['expenseTrackListsNew', {
				descending: true
			}], function (err, response) {
				if (err) {
					$log.log('Error while querying DB', err);
					deferred.reject(err);
				} else {
					var rows = _.has(response, 'rows') ? response.rows : [];
					_.every(rows, function (row, i) {
						var key = _.has(row, 'key') ? row.key : [];
						var value = _.has(row, 'value') ? row.value : {};
						var accType = _.has(value, 'accType') ? value.accType : '';
						var merchant = _.has(value, 'merchant') ? value.merchant : '';
						var date = _.has(value, 'date') ? value.date : '';
						var expense = _.has(value, 'amount') && _.has(value.amount, 'value') ? value.amount.value : 0;
						if (expense > 0) {
							recentSpends.push({
								merchant: merchant,
								dateTime: timeSince(date),
								expense: expense,
								accType: 'CREDIT',
								ATM: false
							});
						}
						return !(recentSpends.length === 3);
					});
					$log.log('recentSpends', recentSpends);
					byRecent = true;
					callResolve();
				}
			});
			// Bills
			config.db(['_design/expenseTrackNew', '_view'])(['expenseBillRemainder', {
				descending: true
			}], function (err, response) {
				if (err) {
					$log.log('Error while querying DB', err);
					deferred.reject(err);
				} else {
					var rows = _.has(response, 'rows') ? response.rows : [];
					_.each(rows, function (row, i) {
						var key = _.has(row, 'key') ? row.key : [];
						var value = _.has(row, 'value') ? row.value : {};
						var account = _.has(value, 'account') ? value.account : '';
						var dueDate = _.has(value, 'dueDate') ? value.dueDate : '';
						var osAmount = _.has(value, 'osAmount') && _.has(value.osAmount, 'value') ? value.osAmount.value : 0;
						var date = timeSince(dueDate);
						if (dueDate !== '' && osAmount > 0) {
							bills.push({
								accName: 'ICICI CREDIT',
								accType: 'CREDIT',
								accNo: !_.isEmpty(account) ? account.substr(account.length - 4) : '',
								amount: osAmount,
								date: !_.isEmpty(date) ? date.substr(0, date.length - 4) : ''
							});
						}
					});
					$log.log('bills', bills);
					byBills = true;
					callResolve();
				}
			});
			// Spends By Accounts
			config.db(['_design/expenseTrackNew', '_view'])(['expenseTrackByAccount', {
				group_level: 1
			}], function (err, response) {
				if (err) {
					$log.log('Error while querying DB', err);
					deferred.reject(err);
				} else {
					var rows = _.has(response, 'rows') ? response.rows : [];
					_.each(rows, function (row, i) {
						var key = _.has(row, 'key') ? row.key : [];
						var value = _.has(row, 'value') ? row.value : {};
						var account = _.has(value, 'account') ? value.account : '';
						var totalExpenses = _.has(value, 'sum') ? value.sum : 0;
						if (account !== '') {
							spendsByAccounts.push({
								accName: 'ICICI CREDIT',
								accNo: !_.isEmpty(account) ? account.substr(account.length - 4) : '',
								expenses: totalExpenses,
								accType: 'CREDIT',
								ATM: false,
								ATMTrans: 0
							});
						}
					});
					$log.log('spendsByAccounts', spendsByAccounts);
					byAcc = true;
					callResolve();
				}
			});
		} else {
			$log.log('window.config not available');
			deferred.reject('window.config not available');
		}

		function callResolve() {
			if (byAcc && byRecent && byBills) {
				deferred.resolve({
					data: {
						recentSpends: recentSpends,
						bills: bills,
						spendsByAccount: spendsByAccounts
					}
				});
			}
		}
		/*$http.get('js/app/expenses/expensesList.json')
			.success(function (response) {
				$log.log('Expenses List Data', response);
				deferred.resolve({
					data: response
				});
			})
			.error(function (error) {
				$log.log('Expenses List Error', error);
				deferred.reject(error);
			});*/
		return deferred.promise;
	};
	var getExpensesBillsData = function () {
		var data = [];
		var deferred = $q.defer();
		if (window.config) {
			config.db(['_design/expenseTrackNew', '_view'])(['expenseBillRemainder', {
				descending: true
			}], function (err, expenseTrackListView) {
				if (err) {
					$log.log('Error while querying DB', err);
					deferred.reject(err);
				} else {
					var rows = _.has(response, 'rows') ? response.rows : [];
					deferred.resolve({
						data: {
							bills: data
						}
					});
				}
			});
		} else {
			$log.log('window.config not available');
			deferred.reject('window.config not available');
		}
		return deferred.promise;
	};
	var getIncomeGraphData = function () {
		var deferred = $q.defer();
		$http.get('js/app/income/income.json')
			.success(function (response) {
				$log.log('Income Data', response);
				deferred.resolve(response);
			})
			.error(function (error) {
				$log.log('Income Error', error);
				deferred.reject(error);
			});
		return deferred.promise;
	};
	var getIncomeListData = function () {
		var deferred = $q.defer();
		$http.get('js/app/income/incomeList.json')
			.success(function (response) {
				$log.log('Income List Data', response);
				deferred.resolve(response);
			})
			.error(function (error) {
				$log.log('Income List Error', error);
				deferred.reject(error);
			});
		return deferred.promise;
	};
	var getDevListData = function () {
		var deferred = $q.defer();
		$http.get('js/app/dev/devList.json')
			.success(function (response) {
				$log.log('Dev List Data', response);
				deferred.resolve(response);
			})
			.error(function (error) {
				$log.log('Dev List Error', error);
				deferred.reject(error);
			});
		return deferred.promise;
	};
	return {
		getExpensesGraphData: getExpensesGraphData,
		getExpensesListData: getExpensesListData,
		getExpensesBillsData: getExpensesBillsData,
		getIncomeGraphData: getIncomeGraphData,
		getIncomeListData: getIncomeListData,
		getDevListData: getDevListData
	};
}