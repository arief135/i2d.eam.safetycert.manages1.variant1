sap.ui.define(
    [
        'sap/ui/core/mvc/ControllerExtension',
        'sap/ui/core/mvc/OverrideExecution',
    ],
    function (
        ControllerExtension,
        OverrideExecution,
    ) {
        'use strict';

        return ControllerExtension.extend("customer.i2d.eam.safetycert.manages1.variant1.SafetyCertificateObjectPageExt", {
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

            setParameterValues: function () {

                var oUrl = window.location;
                var oSearchParams = new URL(oUrl.hash.replace("#", oUrl.origin + "/")).searchParams;

                var sMaintenancePlanningPlant = oSearchParams.get("MaintenancePlanningPlant");
                var sSafetyCertificateType = oSearchParams.get("SafetyCertificateType");
                var sSftyCertRefSftyCertTemplate = oSearchParams.get("SftyCertRefSftyCertTemplate");
                var sWorkPermitReferenceWorkPermit = oSearchParams.get("WorkPermitReferenceWorkPermit");

                const idPlanningPlant = sap.ui.core.Fragment.byId("idCreateSafetyCertificateDialog", "planningPlant");
                const idSafetyCertificateType = sap.ui.core.Fragment.byId("idCreateSafetyCertificateDialog", "safetyCertificateType");
                const idSafetyCertificateTemplate = sap.ui.core.Fragment.byId("idCreateSafetyCertificateDialog", "safetyCertificateTemplate");
                const idRfncWrkPmt = sap.ui.core.Fragment.byId("idCreateSafetyCertificateDialog", "rfncWrkPmt");

                if (sMaintenancePlanningPlant) {
                    idPlanningPlant.setValue(sMaintenancePlanningPlant)
                    this.newPPValue = sMaintenancePlanningPlant
                }
                if (sSafetyCertificateType) {
                    idSafetyCertificateType.setValue(sSafetyCertificateType)
                    this.newPTValue = sSafetyCertificateType
                }
                if (sSftyCertRefSftyCertTemplate) {
                    idSafetyCertificateTemplate.setValue(sSftyCertRefSftyCertTemplate)
                    this.newSftyCrtTemplNumRef = sSftyCertRefSftyCertTemplate
                }
                if (sWorkPermitReferenceWorkPermit) {
                    idRfncWrkPmt.setValue(sWorkPermitReferenceWorkPermit)
                    this.newRfncWrkPmtRef = sWorkPermitReferenceWorkPermit
                }


                // urlParameters: {
                //     MaintenancePlanningPlant: this.newPPValue,
                //     SafetyCertificateType: this.newPTValue,
                //     SftyCertExternalNumber: this.idCertificatNumber.getValue(),
                //     SftyCertRefSftyCertTemplate: this.newSftyCrtTemplNumRef,
                //     WorkPermitReferenceWorkPermit: this.newRfncWrkPmtRef,
                //     DraftUUID: this.onCreateSafetyCertificateDialog.getBindingContext().getObject().DraftUUID,
                //     ValidationScenarioID: "00002",
                //     IsActiveEntity: false
                //    },


            },

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

            // this section allows to extend lifecycle hooks or override public methods of the base controller
            override: {
                /**
                 * Called when a controller is instantiated and its View controls (if available) are already created.
                 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
                 * @memberOf {{controllerExtPath}}
                 */
                onInit: function (oEvent) {

                    const superController = oEvent.getSource().getController()
                    const originalSuperController = Object.assign({}, superController)
                    const that = this

                    superController.displayCreateSafetyCertificateDialog = function () {
                        originalSuperController.displayCreateSafetyCertificateDialog.apply(superController)
                        that.setParameterValues.apply(superController)
                    }


                    //Isolation Item
                    this.sAppId = oEvent.getParameter("id");
                    const isToolbar = sap.ui.getCore().byId(this.sAppId + "--IsolationItems::Table::Toolbar");

                    if (isToolbar) {
                        const createButton = new sap.m.Button({
                            text: 'Create',
                            press: (e) => {
                                this.navigateTo(
                                    'ZPMCustGUI',
                                    'manage',
                                    {
                                        'preferredMode': 'create',
                                        'sap-ushell-navmode': 'explace'
                                    })
                            },
                            enabled: "{= ${ui>/editable} === true}"
                        })
                        isToolbar.insertContent(createButton, 1)

                        const uploadButton = new sap.m.Button({
                            text: 'Upload',
                            press: (e) => {
                                this.navigateTo(
                                    'ZPMCustGUI',
                                    'ZPME010',
                                    {
                                        'sap-ushell-navmode': 'explace'
                                    })
                            },
                            enabled: "{= ${ui>/editable} === true}"
                        })
                        isToolbar.insertContent(uploadButton, 1)
                    }

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
