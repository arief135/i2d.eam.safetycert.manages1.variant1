sap.ui.define(
    [
        'sap/ui/core/mvc/ControllerExtension',
        'sap/ui/core/mvc/OverrideExecution'
    ],
    function (
        ControllerExtension,
        OverrideExecution
    ) {
        'use strict';
        return ControllerExtension.extend("customer.i2d.eam.safetycert.manages1.variant1.SafetyCertificateListExt", {
            metadata: {
                // extension can declare the public methods
                // in general methods that start with "_" are private
                methods: {
                    publicMethod: {
                        public: true /*default*/,
                        final: false /*default*/,
                        overrideExecution: OverrideExecution.Instead /*default*/
                    },
                    finalPublicMethod: {
                        final: true
                    },
                    onMyHook: {
                        public: true /*default*/,
                        final: false /*default*/,
                        overrideExecution: OverrideExecution.After
                    },
                    couldBePrivate: {
                        public: false
                    }
                }
            },
            // adding a private method, only accessible from this controller extension
            _privateMethod: function () { },
            // adding a public method, might be called from or overridden by other controller extensions as well
            publicMethod: function () { },
            // adding final public method, might be called from, but not overridden by other controller extensions as well
            finalPublicMethod: function () { },
            // adding a hook method, might be called by or overridden from other controller extensions
            // override these method does not replace the implementation, but executes after the original method
            onMyHook: function () { },
            // method public per default, but made private via metadata
            couldBePrivate: function () { },
            // this section allows to extend lifecycle hooks or override public methods of the base controller

            async navigateTo(semanticObject, action, params) {
                const globalContainer = sap.ushell.Container

                const navigator = await globalContainer.getServiceAsync("CrossApplicationNavigation")
                navigator.toExternal({
                    target: {
                        semanticObject: semanticObject,
                        action: action
                    },
                    params
                })
            },

            applyCustomParameter: function () {
                const hash = window.location.hash
                const indexQ = hash.indexOf('?')
                const query = hash.substring(indexQ + 1)
                const querySplit = query.split('&')
                let periodValue = undefined

                for (let i = 0; i < querySplit.length; i++) {
                    const queryElement = querySplit[i];
                    const nameVal = queryElement.split('=')
                    if (nameVal.length == 2) {
                        if (nameVal[0] == 'Period') {
                            periodValue = nameVal[1]
                            break
                        }
                    }
                }

                if (!periodValue) {
                    return
                }

                const periodSplit = periodValue.split('-')
                if (periodSplit.length != 2) {
                    return
                }

                if (periodSplit[0].length != 8 || periodSplit[1].length != 8) {
                    return
                }

                const dateFrom = periodSplit[0]
                const dateTo = periodSplit[1]

                const filterBar = sap.ui.getCore().byId(this.sAppId + "--listReportFilter")

                filterBar.attachFilterChange(function (e) {
                    const filterData = filterBar.getFilterData()

                    if (!filterData) {
                        return
                    }

                    if (filterData['SftyCertValidFrmDate']) {
                        return
                    }

                    const strToDate = function (strDate) {
                        const y = parseInt(strDate.substring(0, 4))
                        const m = parseInt(strDate.substring(4, 6)) - 1
                        const d = parseInt(strDate.substring(6, 8))
                        return new Date(y, m, d)
                    }

                    filterData['SftyCertValidFrmDate'] = {
                        low: strToDate(dateFrom),
                        high: strToDate(dateTo)
                    }

                    filterBar.setFilterData(filterData, true)
                }.bind(this))


            },


            override: {
                /**
                 * Called when a controller is instantiated and its View controls (if available) are already created.
                 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
                 * @memberOf {{controllerExtPath}}
                 */
                onInit: function (oEvent) {
                    this.sAppId = oEvent.getParameter("id");
                    const wpToolbar = sap.ui.getCore().byId(this.sAppId + "--template::ListReport::TableToolbar");
                    const uploadButton = new sap.m.Button({
                        text: 'Upload',
                        press: (e) => {
                            this.navigateTo('ZPMCustGUI', 'ZPME012', { 'sap-ushell-navmode': 'explace' })
                        }
                    })
                    wpToolbar.insertContent(uploadButton, 1)

                    // apply custom parameter
                    this.applyCustomParameter()

                },
                /**
                 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
                 * (NOT before the first rendering! onInit() is used for that one!).
                 * @memberOf {{controllerExtPath}}
                 */
                onBeforeRendering: function () {
                },
                /**
                 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
                 * This hook is the same one that SAPUI5 controls get after being rendered.
                 * @memberOf {{controllerExtPath}}
                 */
                onAfterRendering: function () {
                },
                /**
                 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
                 * @memberOf {{controllerExtPath}}
                 */
                onExit: function () {
                },
                // override public method of the base controller
                basePublicMethod: function () {
                }
            }
        });
    }
);
