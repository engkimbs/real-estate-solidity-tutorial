App = {
  web3Provider: null,
  contracts: {},
	
  init: function() {``
    $.getJSON('../real-estate.json', (data) => {
      let list = $('#list');
      let template = $('#template');

      for(i = 0; i < data.length; ++i) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.type').text(data[i].type);``
        template.find('.area').text(data[i].area);
        template.find('.price').text(data[i].price);

        list.append(template.html());
      }
    })

    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('RealEstate.json', (data) => {
      App.contracts.RealEstate = TruffleContract(data);
      App.contracts.RealEstate.setProvider(App.web3Provider);
    })
  },

  buyRealEstate: function() {	
    let id = $('#id').val();
    let name = $('#name').val();
    let price = $('#price').val();
    let age = $('#age').val();

    ethereum.enable().then((accounts) => {
      var account = accounts[0];

      console.log(account)

      App.contracts.RealEstate.deployed().then((instance) => {
        var nameUtf8Encoded = utf8.encode(name);
        return instance.buyRealEstate(id, web3.toHex(nameUtf8Encoded), age, { from: account, value: price });
      }).then(function() {
        $('#name').val('');
        $('#age').val('');
        $('#buyModal').modal('hide');
      }).catch((error) => {
        console.log(error.message);
      })
    })
  },

  loadRealEstates: function() {
	
  },
	
  listenToEvents: function() {
	
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#buyModal').on('show.bs.modal', function(e) {
    let id = $(e.relatedTarget).parent().find('.id').text();
    let price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);

  })
});
