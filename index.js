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
            fund: '',
            oneTimeInvestment: '',
            totalIncome: '',
            netIncome: '',
            interestIncome: '',
            taxes: '',
            years: '',
            email: ''
        },
        calculated: false,
        appliedSavings: [],

    },
    computed: {
        savingButtonDisabled: function () {
            return !(
                this.selectedConfiguration.fund &&
                this.selectedConfiguration.oneTimeInvestment &&
                this.selectedConfiguration.years &&
                this.selectedConfiguration.email
            );
        }
    },


    methods: {
        calculate: function () {
            if (validate(this.selectedConfiguration)) {
                this.selectedConfiguration.totalIncome = calculateFinalSaving(
                    this.selectedConfiguration.oneTimeInvestment,
                    this.selectedConfiguration.fund.interestRate,
                    this.selectedConfiguration.years
                );
                this.selectedConfiguration.interestIncome =
                    this.selectedConfiguration.totalIncome -
                    this.selectedConfiguration.oneTimeInvestment;
                this.selectedConfiguration.taxes = calculateTaxes(this.selectedConfiguration.interestIncome);
                this.selectedConfiguration.netIncome = this.selectedConfiguration.interestIncome -
                    this.selectedConfiguration.taxes;
                this.calculated = true;
            }
        },
        applyForSaving: function () {
            if (validate(this.selectedConfiguration)) {
                const configurationToAdd = {
                    selectedFund: this.selectedConfiguration.fund,
                    years: this.selectedConfiguration.years,
                    oneTimeInvestment: this.selectedConfiguration.oneTimeInvestment,
                    totalIncome: this.selectedConfiguration.totalIncome,
                    email: this.selectedConfiguration.email,
                };
                this.appliedSavings.push(configurationToAdd);

                this.selectedConfiguration.fund = '';
                this.selectedConfiguration.oneTimeInvestment = '';
                this.selectedConfiguration.years = '';
                this.selectedConfiguration.totalIncome = '';
                this.selectedConfiguration.netIncome = '';
                this.selectedConfiguration.interestIncome = '';
                this.selectedConfiguration.taxes = '';
                this.selectedConfiguration.email = '';
                this.calculated = false;
            }

        },
        round: function (input) {
            return Math.round(input * 100) / 100
        },
        format:function (number,) {
            return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');

        }
    }
});


function validate(selectedConfiguration) {
    return (selectedConfiguration.fund && selectedConfiguration.oneTimeInvestment && selectedConfiguration.years);
}

function calculateFinalSaving(initialInvestment, interestRate, years) {
    return initialInvestment * Math.pow(1 + (+interestRate / 100), +years)
}

function calculateTaxes(input) {
    return input * 0.19;
}
