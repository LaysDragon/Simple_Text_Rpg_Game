//網頁物件宣告
var statusBox=function(){
	obj=document.getElementById("status");
	this.set=function(text){
		obj.innerText=text;
	};
};
var historyBox=function(){
	obj=document.getElementById("hostory");
	this.add=function(text){
		obj.innerText=text+"/n"+obj.innerText;
	};
};

//======[資料集]======
//-----<類別宣告區>------
//角色類別
function Living(Name,HP,DEF,AGI,ATK,CRIT,mapctrl){
	this.Name=Name;
	this.MaxHP=HP;//最高血量
	this.HP=HP;
	this.AGI=AGI;//敏捷度，0.00~1.00
	this.DEF=DEF;//防禦力
	this.ATK=ATK;//攻擊力
	this.CRIT=CRIT;//爆擊率，0.01~1.00
	this.mapController=new mapController();//玩家的的棋子控制器
	//直接被攻擊血量並返回造成的傷害
	this.AttackHP=function(Damage){
		this.HP-=(this.HP<Damage?this.HP:Damage);
		return Damage;
	};
	;
	//傳入的為受到的攻擊力，計算後並返回造成的傷害值，並且有機率閃避
	this.AcceptAttack=function(Damege){
		return Math.random<this.AGI?false:this.AttackHP( this.DEF>=Damege?1:(Damage-this.DEF));
	};
	//對傳入的目標進行傷害,並返回造成的傷害值陣列,若為值為false則是遭到閃避
	this.attack=function(Enemy){
		var result;
		for(var max=Math.random()<(this.AGI/2)?1:2,i=0;i<max;i++){
			if(Math.random()<this.CRIT)
				result[i]= Enemy.AttackHP(this.ATK);
			else
				result[i]= Enemy.AcceptAttack(this.ATK);
		}
		return result;
	};
	
}
//基礎模式物件
function modeObj(id,Engine){
	var id="";//模式id
	var engine=Engine;//遊戲引擎物件
	Engine.registerMode(this);
	//接受命令,並且返回一個字串陣列，一個為目前提示輸出，一個為簡略歷史追加用的紀錄
	this.commandAccepted=function(){
		throw "INTERFACE_MUST_BE_IMPLEMENTING_ERROR";
	};
	//檢查指令格式並且返回一個陣列，#無效則返回false
	this.commandCheckede=function(command){
		//待完善，用正規表達式過濾
		/.*/.match();
	};
	//每次切換後都會進行的初始化動作
	this.init=function(){};
}
//----=方向物件
var West={
	name:"West",
	opposite=null
};
var East={
	name:"East",
	opposite=null
};
var South={
	name:"South",
	opposite=null
};
var North={
	name:"North",
	opposite=null
};
//設置方向物件的反方向物件
North.opposite=South;
South.opposite=North;
East.opposite=West;
West.opposite=East;
//字串和方向物件的對應
var directionObj={
	North:North,
	South:South,
	East:East,
	West:West
};
//地圖節點物件類別
function mapNode(Name,Describe,MAR,MS,MapContainter,ID){
	//會出現的怪物跟對應的出現比例,2維陣列[["怪物1","比例"],["怪物2","比例"],…]
	var momsterScale=MS;
	//會出現怪物的機率，0.01~1.00
	var momsterAppearRate=MAR;
	//包含這個節點的容器
	var mapContainer=MapContainer;
	//唯一的id
	this.id=ID;
	//地名 
	var name=Name;
	//地點描述
	var describe =Describe;
	//東西南北向之對接的節點
	var directionNode={
		West:null,
		East:null,
		North:null,
		South:null
	};
	mapContainer.register(this);//將自己進行註冊
	//取得該節點指定方向上的節點紀錄
	this.getNode=function(direction){
		return directionNode[direction.name];
	};
	//直接刪除這個節點指定方向所紀錄的節點
	this.deleteNode=function(direction){
		directionNode[direction.name]=null;
	};
	//直接將這個節點某個方向設置成指定的節點
	this.setNode=function(direction,nodeObj){
		directionNode[direction.name]=nodeObj;
	};
	//判斷這個節點某個方向上是否有記錄節點，有則返回true，沒有為則返回false
	this.hasNode=function(direction){
		return directionNode[direction.name]!=null?true:false;
	};
	//即將這個節點某個方向上的連結完整解除
	this.disconnect= function(direction){
		if(this.hasNode(direction)){
			directionNode[direction.name].deleteNode(direction.opposite);
			this.deleteNode(direction);
		}
			
	};
	//指定將這個節點某個方向和其他節點進行連接
	//並同時會將雙方已經完成的連結完整清理掉避免發生bug
	this.connect= function(direction,nodeObj){
			this.disconnect(direction);
			nodeObj.disconnect(direction.opposite);
			this.setNode(direction,nodeObj);
			nodeObj.setNode(direction.opposite,this);
	};
}
//地圖容器
function mapContainer(){
	this.mapNodes=new Array();//地圖節點集合體
	//地圖初始化
	this.init=function(){
		
	};
	this.register=function(node){
		this.mapNodes[node.id]=node;
	};
}
//地圖棋子控制物件類別
function mapController(){
	var currentNode;
	//在這裡將進行完整地圖的拼湊和初始化，並指定起始的節點
	this.init=function(){
		throw "INTERFACE_MUST_BE_IMPLEMENTING_ERROR";
	};
	//將棋子往某個方向移動並且回傳結果，成功返回到達的節點，失敗false
	this.move=function(direction){
		if(this.canMove(direction)){
			currentNode=currentNode.getNode(direction);
			return currentNode;
		}else
			return false;
	};
	//判斷某個方位是否有路可以繼續前進
	this.canMove=function(direction){
		return currentNode.hasNode(direction);
	};
}
//----<人物>-----
//----<怪物>-----
//ps.名字，血，防禦，敏捷，攻擊,爆擊
//怪物1
var monster;
monster[0]=new Living("雪怪",200,10,0.01,20,0.3);
//怪物2
monster[1]=new Living("食人兔",50,2,0.1,5,0.05);
//怪物3
monster[2]=new Living("小陸",100,5,0.01,10,0.1);
//=====[代碼開始]=====
//-----<模式>-----
//初始化，重置
//-繼承-

//戰鬥
//地圖移動

//遊戲引擎，模式控制器物件
var GameEngine=function(){
	//已經註冊的mode物件
	var modelist;
	//目前遊戲所處於的模式
	var currentMode;
	//執行完指令後會切換的模式
	var nextMode;
	//玩家物件
	this.player;
	this.currentMap;
	//接受指令輸入,并且將得到的結果送到網頁上
	this.commandAccepted=function(command){
		this.output(this.modelist[currentMode].commandAccepted(command));
		if(nextMode!=""){
			this.toggleMode(nextmode);
			nextMode="";
		}
	};
	//用來同時操作兩個輸出框,輸入一個1維陣列,索引：0為狀態，1為簡略歷史
	this.output=function(text){
		if(text["status"]!=null)
			statusBox.set(text["status"]);
		if(text["history"]!=null)
			historyBox.add(text["hostory"]);
	};
	//註冊模式物件
	this.registerMode=function(modeObj){
		modelist[modeObj.id]=mode;
	};
	//切換引擎模式到指定的模式,並且將結果送到網頁上
	this.toggleMode=function(modeID){
		currentMode=modeID;
		this.output(modelist[currentMode].init());
		
	};
	//由模式物件所使用，在執行完指令後直接切換到這個模式
	this.requireToggleMode=function(modeId){
		nextMode=modeId;
	};
};
function Init(){
	
}




