/**
 * Created by jonas on 13.06.16.
 */
var station = {
    markers : [],
    infoWindows : [],
    markerListeners : [],
    contentString : '',
    connectorsString : '',
    selectedCapacity : '',
    /*
     * Connectors
     */
    conns : {
        typesIDs : {
            '0' : 'Unspecified',
            '14' : 'Schuko',
            '22' : 'Danish (Section 107-2-D1)',
            '29' : 'Tesla Connector Roadster',
            '30' : 'CHAdeMO',
            '31' : 'Type 1',
            '32' : 'Type 2',
            '60' : 'Type1/Type2',
            '34' : 'Blue industrial 3-pin',
            '35' : 'Blue industrial 4-pin',
            '36' : 'Red industrial 5-pin',
            '38' : 'Marechal',
            '39' : 'CCS/Combo',
            '40' : 'Tesla Connector Model',
            '41' : 'Combo + CHAdeMO',
            '42' : 'CHAdeMO + Type 2',
            '43' : 'CHAdeMO + Combo + AC-Type2',
            '50' : 'Type 2 + Schuko',
            '52' : 'Type 2 + Danish (Section 107-2-D1)'
        },
        types : {
            schuko : ['14', '50'],
            type1 : ['31', '60'],
            type2 : ['32', '60', '42', '50', '52'],
            type2ac : ['43'],
            chademo : ['30', '41', '42', '43'],
            combo : ['39', '41'],
            ind3pin : ['34'],
            ind4pin : ['35'],
            ind5pin : ['36'],
            teslaModelS : ['40'],
            teslaRoadster : ['29']
        },
        capacity : {
            0 : {'id':0,'name':'Unspecified','current':'ukjent', 'kW':0, 'volt':0, 'ampere':0},
            1 : {'id':1,'name':'Battery exchange','current':'ukjent', 'kW':0, 'volt':0, 'ampere':0},
            7 : {'id':7, 'name':'3,6 kW - 230V 1-phase max 16A','current':'AC', 'kW':3.6, 'volt':230, 'ampere':16},
            8 : {'id':8, 'name':'7,4 kW - 230V 1-phase max 32A','current':'AC', 'kW':7.4, 'volt':230, 'ampere':32},
            10 : {'id':10, 'name':'11 kW - 400V 3-phase max 16A','current':'AC', 'kW':11, 'volt':400, 'ampere':16},
            11 : {'id':11, 'name':'22 kW - 400V 3-phase max 32A','current':'AC', 'kW':22, 'volt':400, 'ampere':22},
            12 : {'id':12, 'name':'43 kW - 400V 3-phase max 63A','current':'AC', 'kW':43, 'volt':400, 'ampere':63},
            13 : {'id':13, 'name':'50 kW - 500VDC max 100A','current':'DC', 'kW':50, 'volt':500, 'ampere':100},
            23 : {'id':23, 'name':'100 kW - 500VDC max 200A','current':'DC', 'kW':100, 'volt':500, 'ampere':200},
            16 : {'id':16, 'name':'230V 3-phase max 16A','current':'AC', 'kW':3.7, 'volt':230, 'ampere':16},
            17 : {'id':17, 'name':'230V 3-phase max 32A','current':'AC', 'kW':7.3, 'volt':230, 'ampere':32},
            18 : {'id':18, 'name':'230V 3-phase max 63A','current':'AC', 'kW':14.7, 'volt':230, 'ampere':64},
            19 : {'id':19, 'name':'20 kW - 500VDC max 50A','current':'DC', 'kW':20, 'volt':500, 'ampere':50},
            20 : {'id':20, 'name':'Less then 100 kW + 43 kW - 500VDC max 200A + 400V 3-phase max 63A','current':'DC', 'kW':43, 'volt':400, 'ampere':63},
            21 : {'id':21, 'name':'Less then 100 kW + 22 kW - 500VDC max 50A + 400V 3-phase max 32A','current':'DC', 'kW':22, 'volt':400, 'ampere':32},
            22 : {'id':22, 'name':'135 kW - 480VDC max 270A','current':'DC', 'kW':135, 'volt':480, 'ampere':270}
        }
    },
    carModels : {
    },
    updateCarList : function(){
        //Adding elements to the car list dropdown
        var txt = '';
        for(var car in carModels){
            txt += '<option value="'+car+'">' + car + '</option>';
        }
        $('#select-car').html(txt);
    },
    init : function() {
        station.carModels = {
            'Nissan Leaf' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2, conns.types.chademo),
            'BMW i3' : conns.types.schuko.concat(conns.types.schuko, conns.types.type2, conns.types.combo),
            'Buddy' : conns.types.schuko,
            'Citroën Berlingo' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2, conns.types.chademo),
            'Citroën C-ZERO' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2, conns.types.chademo),
            'Ford Focus Electric' : conns.types.schuko.concat(conns.types.schuko,conns.types.type1, conns.types.type2),
            'Kia Soul Electric' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2, conns.types.chademo),
            'Mercedes B-klasse ED' : conns.types.schuko.concat(conns.types.schuko, conns.types.type2),
            'Mitsubishi i-MIEV' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2, conns.types.chademo),
            'Nissan e-NV200/Evalia' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2, conns.types.chademo),
            'Peugeot iOn' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2, conns.types.chademo),
            'Peugeot Partner' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2, conns.types.chademo),
            'Renault Kangoo ZE' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2),
            'Renault Twizy' : conns.types.schuko,
            'Renault Zoe' : conns.types.schuko.concat(conns.types.schuko, conns.types.type2),
            'Reva' : conns.types.schuko,
            'Tesla Model S' : conns.types.schuko.concat(conns.types.schuko, conns.types.type2, conns.types.ind3pin, conns.types.ind5pin, conns.types.teslaModelS),
            'Tesla Roadster' : conns.types.schuko.concat(conns.types.schuko, conns.types.teslaRoadster),
            'Think' : conns.types.schuko,
            'VW e-Golf' : conns.types.schuko.concat(conns.types.schuko, conns.types.type2, conns.types.combo),
            'VW e-up!' : conns.types.schuko.concat(conns.types.schuko, conns.types.type1, conns.types.type2),
        }
    }
};
