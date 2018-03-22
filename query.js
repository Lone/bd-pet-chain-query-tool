/**
 * function startQueryPets
 * @param {Object} options [可选]
 * @config {Integer} options.maxPage  最多查询的页数, 可选
 * @config {Array} options.conf 各级别狗狗可接受的价格， 可选
 *
 * @example:
 * startQueryPets({maxPage: 30});
 */
function startQueryPets (options) {
    options = options || {};
    var maxPage = options.maxPage || 10;
    var lib = 'c3e5ef7'; //这个是js最终产出的包名，会有根据实际变化，具体如何获得参见RM文档
    var conf = options.conf || [0, 800, 1000, 2000, 4000, 5000];
    var rareName = ['普通', '稀有', '卓越', '史诗', '神话', '传说'];
    var app = require(lib);
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
    
    function queryPets () {
        app.api.queryPetsOnSale(opt)
        .then(function (res) {
            var data = res.data;
            if (!data.hasData) return;
            for(var index=0, length=data.petsOnSale.length; index < length; index ++) {
                var pet = data.petsOnSale[index];
                var rare = pet.rareDegree;
                var price = parseFloat(pet.amount);
                if (price < conf[rare]) {
                    var url = 'https://pet-chain.baidu.com';
                    url += '/chain/detail?channel=market&petId='+ pet.petId;
                    console.log(rareName[rare], price, url);            
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
