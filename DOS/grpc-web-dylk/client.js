// Carriers
const {CarrierParams, CarrierParam} = require('./carriers_pb.js');
const {CarriersClient} = require('./carriers_grpc_web_pb.js');

// Vales de equipo
const {VoucherParams, VoucherParam, VoucherIdList} = require('./vouchers_pb.js');
const {VouchersClient} = require('./vouchers_grpc_web_pb.js');

function clearSelect(valesSelect) {
    while (valesSelect.options.length > 0) {
        valesSelect.remove(0);
    }

    let op = document.createElement('option');
    op.value = '';
    op.text  = 'Seleccione uno o más vales...';
    op.disabled = true;
    valesSelect.add(op);
}

function getValesDeEquipo() {
    let vouchersClient = new VouchersClient('http://' + window.location.hostname + ':8082', null, null);
    let voucherParamsRequest = new VoucherParams();

    let carrier = document.getElementById('carrierSelect').value;
    let carrierParam = new VoucherParam();
    carrierParam.setName('carrierCode');
    carrierParam.setValue(carrier);

    let patioParam = new VoucherParam();
    patioParam.setName('patioCode');
    patioParam.setValue('NLD');

    let statusParam = new VoucherParam();
    statusParam.setName('status');
    statusParam.setValue('PATIO');

    let paramList = [ carrierParam, patioParam, statusParam ];

    let plataforma = document.getElementById('plataformaInput').value;
    if (plataforma) {
        let plataformaParam = new VoucherParam();
        plataformaParam.setName('platform');
        plataformaParam.setValue(plataforma);
        paramList.push(plataformaParam);
    }
    voucherParamsRequest.setParamlistList(paramList);

    let voucherPageParam = new VoucherParam();
    voucherPageParam.setName('per_page');
    voucherPageParam.setValue('2500');
    voucherParamsRequest.setPageparamlistList([ voucherPageParam ]);

    vouchersClient.listVouchers(voucherParamsRequest, {}, (err, response) => {
        if (err) {
            console.log(`Unexpected error for listVouchers: code = ${err.code}` +
                        `, message = "${err.message}"`);
        } else {
            let vouchers = response.getVoucherlistList();
            // console.log(vouchers);

            let valesSelect = document.getElementById('valesSelect');
            clearSelect(valesSelect);

            for (let i of vouchers) {
                // console.log(i.getId(), i.getCarriercode(), i.getPlatform(), i.getStatus(), i.getPatiocode());
                let op = document.createElement('option');
                op.value = i.getId();
                op.text  = i.getPlatform() + ' (ID: ' + i.getId() + ')';
                valesSelect.add(op);
            }
        }
    });
}

function doSalidasEquipo() {
    let valesSelect = document.getElementById('valesSelect');
    let vales = valesSelect.options;
    let doGrpc = false;
    let valesElegidos = [];
    let idxElegidos = {};

    for (let i = 0; i < vales.length; i++) {
        if (vales[i].selected) {
            // console.log(vales[i].value);
            doGrpc = true;
            let id = parseInt(vales[i].value);
            valesElegidos.push(id);
            idxElegidos[id] = i;
        }
    }
    if (doGrpc) {
        // console.log(valesElegidos);
        let vouchersClient = new VouchersClient('http://' + window.location.hostname + ':8082', null, null);

        let voucherIdListParam = new VoucherIdList();
        voucherIdListParam.setIdsList(valesElegidos);

        vouchersClient.doSalidasEquipoValeCompleto(voucherIdListParam, {}, (err, response) => {
            if (err) {
                console.log(`Unexpected error for doSalidasEquipoValeCompleto: code = ${err.code}` +
                            `, message = "${err.message}"`);
            } else {
                let retCode = response.getReturncode();
                let retMessage = response.getReturnmessage();
                console.log(retCode, retMessage);
                window.alert(retMessage);

                if (retCode == 0) {
                    arr = retMessage.split(' ; ');
                    goodArr = arr[0].split(' => ');
                    successArr = goodArr[1].split(', ').reverse();

                    for (let id of successArr) {
                        valesSelect.remove(idxElegidos[parseInt(id)]);
                    }
                }
            }
        });
    }
}


let buscarButton = document.getElementById('buscarButton');
buscarButton.addEventListener('click', getValesDeEquipo);

let salidaButton = document.getElementById('salidaButton');
salidaButton.addEventListener('click', doSalidasEquipo)

let carriersClient = new CarriersClient('http://' + window.location.hostname + ':8082', null, null);
// console.log(window.location.hostname);

let carrierParamsRequest = new CarrierParams();

let carrierParam = new CarrierParam();
carrierParam.setName('disabled');
carrierParam.setValue('false');
carrierParamsRequest.setParamlistList([ carrierParam ]);

let carrierPageParam = new CarrierParam();
carrierPageParam.setName('per_page');
carrierPageParam.setValue('2500');
carrierParamsRequest.setPageparamlistList([ carrierPageParam ]);

carriersClient.listCarriers(carrierParamsRequest, {}, (err, response) => {
    if (err) {
        console.log(`Unexpected error for listCarriers: code = ${err.code}` +
                    `, message = "${err.message}"`);
    } else {
        let carriers = response.getCarrierlistList();
        // console.log(carriers);

        let carrierSelect = document.getElementById('carrierSelect');

        for (let i of carriers) {
            // console.log(i.getId(), i.getCode(), i.getTitle(), i.getDisabled());
            let op = document.createElement('option');
            op.value = i.getCode();
            op.text  = i.getTitle();
            carrierSelect.add(op);
        }
    }
});
