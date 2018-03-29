/**
 * function startQueryPets
 * @param {Object} options [可选]
 * @config {Integer} options.maxPage  最多查询的页数, 可选
 * @config {Array} options.conf 各级别狗狗可接受的价格， 可选
 * @config {Integer} options.type 查询类型 0=狗狗集市，1=繁育中心
 *
 * @example:
 * startQueryPets(); //以默认价格查询10页狗市
 * startQueryPets({maxPage: 30});  //以默认价格查询30页狗市
 * startQueryPets({maxPage: 50, type: 1, conf: [0,200,300,400,1000,1000]}); //以自定义价格查询50页繁育中心
 */
function startQueryPets (options) {
    options = options || {};
    var maxPage = options.maxPage || 10;
    var lib = 'c3e5ef7'; //这个是js最终产出的包名，会有根据实际变化，具体如何获得参见RM文档
    var conf = options.conf || [0, 800, 1000, 2000, 4000, 5000];
    var type = options.type || 0;
    var app = require(lib);
    var apiConf = [
        {
            method: 'queryPetsOnSale',
            channel: 'market',
            result: 'petsOnSale',
            time: 'coolingInterval'
        },
        {
            method: 'getBreedList',
            channel: 'breed',
            result: 'pets4Breed',
            time: 'incubateTime'
        }
    ];
    var opt = {
        pageNo: 1,
        pageSize: 10,
        querySortType: 'CREATETIME_ASC',
        petIds: [],
        lastAmount: null,
        lastRareDegree: null,
        requestId: 1521623341267,
        appId: 1,
        tpl: '',
        timeStamp: null,
        nounce: null,
        token: null
    };
    var rareName = ['普通', '稀有', '卓越', '史诗', '神话', '传说'];
    
    function queryPets () {
        var _config = apiConf[type];
        
        if (!_config || !app.api[_config.method]) {
            return;
        }
        app.api[_config.method](opt)
        .then(function (res) {
            var data = res.data;
            if (!data.hasData) return;
            var list = data[_config.result];
            if (!list) return;
            var host = 'https://pet-chain.baidu.com';
            
            for(var index=0, length=list.length; index < length; index ++) {
                var pet = list[index];
                var rare = pet.rareDegree;
                var price = parseFloat(pet.amount);
                if (price < conf[rare]) {
                    var url = '/chain/detail?channel=' + _config.channel + '&petId='+ pet.petId;
                    console.log(rareName[rare]+pet.generation+'代', pet[_config.time], price, host+url);            
                }
                opt.petIds.push(pet.petId);
                opt.lastAmount = pet.amount;
                opt.lastRareDegree = rare;
            }
            if ( ++opt.pageNo <= maxPage) {
                setTimeout(queryPets, 500);
            }
        });
    }
    queryPets();
}

