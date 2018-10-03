angular.module('info_app', ['ngSanitize'])
	.controller("mainController", ["$scope", "$http", "$window", function($scope, $http, $window) {
		$scope.form_data = {};
		$scope.available_companies = [];

		$http.get('/get')
			.then( function(response) {
				console.log(response);
				$scope.info = response.data;
				updateSalaryCalc(response.data);
				console.log($scope.available_companies);
			});

		$scope.createInfo = function() {
			var valid = validateForm($scope.form_data);
			if (valid) {
				$http.post('/create', $scope.form_data)
					.then( function(response) {
						if (!response.data.errors) {
							$scope.form_data = {};
							$scope.info = response.data;
							$scope.fname_text = response.config.data.fname;
							$scope.lname_text = response.config.data.lname;
							$scope.address_text = response.config.data.address;
							$scope.company_text = response.config.data.company;
							$scope.salary_text = response.config.data.salary;
							updateSalaryCalc([response.config.data]);
						} else {
							console.log(response.data.name+": "+response.data.message);
						}
					});
			} else {
				$window.alert("Invalid Data");
			}

		};

		function updateSalaryCalc(data) {
			for (var i in data) {
				var company_name = data[i].company;
				var temp_salary = data[i].salary;
				var exists = false;
				var index = 0;
				for (var i in $scope.available_companies) {
					if ($scope.available_companies[i].company === company_name) {
						exists = true;
						index = i;
						break;
					}
				}
				if (exists) {
					$scope.available_companies[index].costs += parseInt(temp_salary);
				} else {
					$scope.available_companies.push({"company":company_name, "costs":temp_salary});
				}
			}
		}
	}]);

function validateForm(data) {

	for (var e in data) {
		if (data[e] == "") {
			return false;
		}
	}

	var valid_number = /[0-9]/g;
	if (!valid_number.test(data.salary) || !/[a-zA-Z']/.test(data.fname) || !/[a-zA-Z']/.test(data.lname) || !/[a-zA-Z0-9,]/.test(data.address)) {
		return false;
	}

	return true;
}
