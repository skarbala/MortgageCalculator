const app = new Vue({
    el: '#app',
    created: function () {
        return fetch("storage/storage.json")
            .then(response => response.json())
            .then(data => app.products = data);
    },
    data: {
        products: [],
        message: 'Savings calculator',
        selectedConfiguration: {
            fund: 0,
            oneTimeInvestment: 0,
            result: {
                interest: '',
                total: '',
                taxes: '',
                netIncome: '',
            },
            years: 0
        },
        appliedSavings: [],

    },


    methods: {
        calculate: function () {
            if (validate(this.selectedConfiguration)) {
                this.selectedConfiguration.result.total = calculateFinalSaving(
                    this.selectedConfiguration.oneTimeInvestment,
                    this.selectedConfiguration.fund.interestRate,
                    this.selectedConfiguration.years
                );
                this.selectedConfiguration.result.interest =
                    this.selectedConfiguration.result.total -
                    this.selectedConfiguration.oneTimeInvestment;
                this.selectedConfiguration.result.taxes = calculateTaxes(this.selectedConfiguration.result.interest);
                this.selectedConfiguration.result.netIncome = this.selectedConfiguration.result.interest -
                    this.selectedConfiguration.result.taxes;

            }
        },
        applyForSaving: function () {
            if (validate(this.selectedConfiguration)) {
                const result = {
                    selectedFund: selectedConfiguration.fund,
                    years: selectedConfiguration.years,
                    oneTimeInvestment: this.selectedConfiguration.oneTimeInvestment,
                    result: this.selectedConfiguration.result,
                };
                this.appliedSavings.push(result);

                this.selectedConfiguration.fund = '';
                this.selectedConfiguration.oneTimeInvestment = '';
                this.selectedConfiguration.years = '';
                this.selectedConfiguration.result.netIncome='';
                this.selectedConfiguration.result.taxes='';
                this.selectedConfiguration.result.interest='';
                this.selectedConfiguration.result.total='';
            }

        },
        round: function (input) {
            return Math.round(input * 100) / 100
        }
    }
});


function validate(selectedConfiguration) {
    return (selectedConfiguration.fund && selectedConfiguration.oneTimeInvestment);
}

function calculateFinalSaving(initialInvestment, interestRate, years) {
    return initialInvestment * Math.pow(1 + (+interestRate / 100), +years)
}

function calculateTaxes(input) {
    return input * 0.19;
}
