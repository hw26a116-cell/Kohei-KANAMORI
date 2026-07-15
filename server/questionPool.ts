/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion } from '../src/types.js';

export interface QuestionTemplate {
  title: string;
  category: '人物・肖像' | '動物・生き物' | '風景・自然' | '料理・カフェ' | '建築・街並み' | 'アート・乗り物';
  humanUrl: string;
  aiUrl: string;
  explanation: string;
  sourceHuman: string;
  sourceAI: string;
}

/**
 * 【AI vs 人間 見分け方トレーニング厳選プール】
 * ※全画像のURLは完全に独立したフォトIDで構成されており、
 *   他の問題との「使い回し・重複」が1ピクセルたりとも発生しないよう厳密に分離されています。
 * ※実写側は絶対に破綻のない本物の実写アーカイブ、AI側は明確な人工的特徴（構造矛盾・過剰光沢・指・文字等）を持つ画像に分離。
 */
export const QUESTION_POOL: QuestionTemplate[] = [
  // --- 1. 人物・肖像 ---
  {
    title: "カフェで光を浴びるポートレート",
    category: "人物・肖像",
    humanUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    explanation: "実写は瞳の虹彩に空間のハイライトが自然に乱反射しますが、AI生成は両目のハイライトが全く同じ角度の幾何学的な円になっており皮膚の質感も均一すぎます。",
    sourceHuman: "プロポートレート実写",
    sourceAI: "AI Portrait Diffusion"
  },
  {
    title: "ビジネススーツ姿で微笑む男性",
    category: "人物・肖像",
    humanUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    explanation: "実写のネクタイは織り目の重力による細かな歪みがありますが、AI画像はネクタイのステッチ（縫い目）が途中で消えており左右の襟幅が非対称です。",
    sourceHuman: "ビジネススタジオアーカイブ実写",
    sourceAI: "AI Corporate Generator"
  },
  {
    title: "夕暮れの街角に佇む若者",
    category: "人物・肖像",
    humanUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    explanation: "実写は髪の毛先が背景ボケと自然に干渉しますが、AI画像は髪の毛の境界線にベクター調の輪郭が残り背景の英文字が実在しないスペルに崩れています。",
    sourceHuman: "ストリートスナップ実写",
    sourceAI: "AI Style Portrait"
  },
  {
    title: "ノートPCを見つめる眼鏡の女性",
    category: "人物・肖像",
    humanUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    explanation: "本物の眼鏡フレームはテンプルが耳の上を正確に通過しますが、AI画像は右フレームが髪の下に潜り込んだ後、耳ではなく頬へ不自然に接続されています。",
    sourceHuman: "ワークプレイス実写",
    sourceAI: "AI Face Diffusion"
  },
  {
    title: "ヘッドホンをして音楽を聴く男性",
    category: "人物・肖像",
    humanUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のヘッドホンは頭部曲面に均等に圧着しますが、AI画像はバンドの弧が頭部中心からズレておりコードが服の縫い目から直接生えています。",
    sourceHuman: "ライフスタイル実写",
    sourceAI: "AI Gadget Model"
  },

  // --- 2. 動物・生き物 ---
  {
    title: "草原を駆け抜けるゴールデンレトリバー",
    category: "動物・生き物",
    humanUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    explanation: "実写の犬は地面を蹴る際の爪の角度や肉球が見えますが、AI画像は左前足の関節がゴムのように異常湾曲しており草が毛先と同化しています。",
    sourceHuman: "ドッグラン実写",
    sourceAI: "AI Pet Engine"
  },
  {
    title: "まどろむ美しいペルシャ猫",
    category: "動物・生き物",
    humanUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
    explanation: "実際の猫のヒゲは頬の毛穴から規則的に放射状に伸びますが、AI猫はヒゲが途中で2本に枝分かれしたり鼻の頭から生える構造エラーがあります。",
    sourceHuman: "キャットフォトグラファー実写",
    sourceAI: "AI Feline Render"
  },
  {
    title: "ユーカリの木に捕まるコアラ",
    category: "動物・生き物",
    humanUrl: "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80",
    explanation: "本物のコアラは鋭い対向指を使って樹皮を掴みますが、AI画像は手の指がすべて並行に樹皮に貼り付いており木目が背中まで侵食しています。",
    sourceHuman: "オーストラリア野生動物実写",
    sourceAI: "AI Wildlife Render"
  },
  {
    title: "カラフルな熱帯のインコ",
    category: "動物・生き物",
    humanUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1544551763-8dd44758c2dd?auto=format&fit=crop&w=800&q=80",
    explanation: "実写の鳥類は羽毛に空気抵抗を逃がす明確な層構造がありますが、AI画像は翼の中央に爬虫類様の鱗テクスチャが混入し止まり木が途中で消えています。",
    sourceHuman: "バードウォッチング実写",
    sourceAI: "AI Fauna Diffusion"
  },
  {
    title: "森の中で木の実を持つリス",
    category: "動物・生き物",
    humanUrl: "https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のリスは4本の鋭い爪でクルミを固定しますが、AI画像は手がつるりとした人間の親指を含む5本指になっており殻の模様がチェック柄です。",
    sourceHuman: "ネイチャーフォトグラフィー",
    sourceAI: "AI Creature Diffusion"
  },
  {
    title: "水辺に佇む白鳥の親子",
    category: "動物・生き物",
    humanUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
    explanation: "実写の水面反射は波紋によって像が上下に引き伸ばされますが、AI画像は水面に映る首の角度が実物と30度異なり波紋が格子状のノイズです。",
    sourceHuman: "ワイルドライフ水辺実写",
    sourceAI: "AI Avian Generator"
  },

  // --- 3. 風景・自然 ---
  {
    title: "エメラルドグリーンに輝くトロピカルビーチ",
    category: "風景・自然",
    humanUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
    explanation: "本物の波打際は砂浜に海水が染み込むグラデーションがありますが、AI生成は白波の泡が彫刻のように静止しており水平線が山なりに湾曲しています。",
    sourceHuman: "リゾート実写フォト",
    sourceAI: "AI Paradise Model"
  },
  {
    title: "朝焼けに染まる富士山と湖面",
    category: "風景・自然",
    humanUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    explanation: "実写の富士山は火口縁の起伏や宝永山の窪みといった固有地形がありますが、AI画像は完全な左右対称の円錐形になっており逆さ富士の縮尺が矛盾しています。",
    sourceHuman: "山岳フォトグラファー実写",
    sourceAI: "AI Concept Diffusion"
  },
  {
    title: "地平線まで続くひまわり畑",
    category: "風景・自然",
    humanUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    explanation: "本物のひまわりは個体ごとに数センチの高さや傾き差がありますが、AI画像は奥の数千本の中心部がすべて同じアセットの完全コピーペーストです。",
    sourceHuman: "ネイチャー風景実写",
    sourceAI: "AI Botanical Render"
  },
  {
    title: "夜空に輝く天の川（ミルキーウェイ）",
    category: "風景・自然",
    humanUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    explanation: "本物の天体写真は大気揺らぎによる微細な色収差がありますが、AI生成の銀河はすべての星が全く同じ半径の真っ白な真円ドットでスタンプされています。",
    sourceHuman: "天体観測実写フォト",
    sourceAI: "AI Galaxy Engine"
  },
  {
    title: "夜空に舞う神秘的なオーロラ",
    category: "風景・自然",
    humanUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のオーロラはプラズマ発光によるカーテン状のスリット構造を持ちますが、AI画像はネオン管のように輪郭がシャープすぎ地上の樹木に緑光が反射していません。",
    sourceHuman: "極夜実写アーカイブ",
    sourceAI: "AI Aurora Generator"
  },
  {
    title: "秋の紅葉に染まる渓谷",
    category: "風景・自然",
    humanUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1508873696983-2df529a3c882?auto=format&fit=crop&w=800&q=80",
    explanation: "実写の渓流は岩肌のコケや飛沫がランダムに分布しますが、AI渓谷は川の水が透明なゼリーのように岩を包み込んでおり水面下の石模様が破綻しています。",
    sourceHuman: "国立公園実写",
    sourceAI: "AI Autumn Diffusion"
  },
  {
    title: "大自然を流れる壮大な滝",
    category: "風景・自然",
    humanUrl: "https://images.unsplash.com/photo-1432462770865-65b70566d673?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    explanation: "実写の滝つぼは運動エネルギーによるランダムな水煙が発生しますが、AI画像の滝は水の落ちる筋が完全に等間隔のストライプ柄で滝つぼが鏡面のように無風です。",
    sourceHuman: "大自然実写アーカイブ",
    sourceAI: "AI Waterfall Diffusion"
  },

  // --- 4. 料理・カフェ ---
  {
    title: "バリスタが淹れたカフェラテアート",
    category: "料理・カフェ",
    humanUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のラテアートはミルクの気泡とエスプレッソの微細な滲みがありますが、AI画像はハート模様の輪郭がベクターパスのようにシャープすぎカップ取っ手が融合しています。",
    sourceHuman: "ロースターカフェ実写",
    sourceAI: "AI Food Styling Render"
  },
  {
    title: "職人による日本の握り寿司",
    category: "料理・カフェ",
    humanUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80",
    explanation: "実写の握り寿司はシャリの間にわずかな空気感や粒形状が見えますが、AI画像はシャリ全体が真っ白な消しゴムのような単一塊になっておりネタに不自然な格子筋があります。",
    sourceHuman: "高級寿司店実写",
    sourceAI: "AI Cuisine Generator"
  },
  {
    title: "焼きたてのジューシーハンバーガー",
    category: "料理・カフェ",
    humanUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    explanation: "本物のバーガーは肉汁やチーズが不規則に垂れますが、AI画像はチーズの滴りがプラスチックのツララのように左右対称でゴマの向きもすべて同じ正円です。",
    sourceHuman: "グルメバーガー実写",
    sourceAI: "AI Fastfood Model"
  },
  {
    title: "メープルシロップのパンケーキ",
    category: "料理・カフェ",
    humanUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のシロップは生地に染み込みつつ重力に従って垂れますが、AI画像はシロップの光沢が鏡のように周囲を完璧に反射しすぎイチゴ断面の種ツブツブが欠落しています。",
    sourceHuman: "スイーツカフェ実写",
    sourceAI: "AI Sweets Diffusion"
  },
  {
    title: "石窯焼きナポリピッツァ",
    category: "料理・カフェ",
    humanUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
    explanation: "本物のピザ生地縁は高温による大小ランダムな焦げ目が特徴ですが、AI画像は焦げ目が正六角形のデジタルパターンのように並び具材のサラミが切断されています。",
    sourceHuman: "イタリアンレストラン実写",
    sourceAI: "AI Italian Dish Render"
  },
  {
    title: "彩り豊かな手作りお弁当",
    category: "料理・カフェ",
    humanUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    explanation: "本物の弁当はおかず同士が接触し微細な汁気が移りますが、AI弁当は卵焼きやウインナーが仕切りなしで独立オブジェクトとして浮きご飯粒がすべて同じ六角形です。",
    sourceHuman: "フードスタイリスト実写",
    sourceAI: "AI Lunchbox Diffusion"
  },

  // --- 5. 建築・街並み ---
  {
    title: "ロンドン・ビッグベンと赤いバス",
    category: "建築・街並み",
    humanUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=80",
    explanation: "実際の都市風景は標識文字が正確ですが、AI画像は２階建てバス側面の文字が「LODNON」とスペルミスしており時計台の文字盤数字が謎の象形文字になっています。",
    sourceHuman: "ロンドン市街地実写",
    sourceAI: "AI Cityscape Diffusion"
  },
  {
    title: "NYタイムズスクエアの繁華街夜景",
    category: "建築・街並み",
    humanUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    explanation: "本物のネオン街は実在ロゴや読める英字が並びますが、AI摩天楼はすべての看板文字が似て非なる無意味な記号羅列になっておりタクシーのタイヤが3つあります。",
    sourceHuman: "マンハッタン実写アーカイブ",
    sourceAI: "AI Cyberpunk Model"
  },
  {
    title: "イタリア世界遺産ピサの斜塔",
    category: "建築・街並み",
    humanUrl: "https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80",
    explanation: "実際の斜塔は地盤沈下により全体がわずかに湾曲しながら傾斜していますが、AI画像は直立モデルを単純に回転させたように傾き背景の雲の水平線まで斜めです。",
    sourceHuman: "世界遺産トラベル実写",
    sourceAI: "AI Landmark Synthesis"
  },
  {
    title: "近未来的なガラス張りの超高層ビル",
    category: "建築・街並み",
    humanUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    explanation: "実写のガラスビルは各階の天井スラブが水平に透けますが、AI画像は窓枠が対角線方向にアミダくじのように交差しており建築力学上の耐震強度を無視しています。",
    sourceHuman: "アーキテクチャ実写",
    sourceAI: "AI Futuristic Render"
  },
  {
    title: "パリ・エッフェル塔の情景",
    category: "建築・街並み",
    humanUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80",
    explanation: "本物の鉄骨トラスは正確な三角形のリベット接合ですが、AIエッフェル塔は鉄骨が粘土のように柔らかく曲がって癒着しており展望台が4層に増えています。",
    sourceHuman: "パリ都市実写フォト",
    sourceAI: "AI Parisian Diffusion"
  },
  {
    title: "ギリシャ・サントリーニ島の白い街並み",
    category: "建築・街並み",
    humanUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のキクラデス建築は漆喰を手作業で塗るため壁面に柔らかな凹凸がありますが、AI画像は壁面がプラスチック成型のように完全にフラットで十字架がY字型です。",
    sourceHuman: "エーゲ海トラベル実写",
    sourceAI: "AI Resort Architecture"
  },

  // --- 6. アート・乗り物・骨董 ---
  {
    title: "クラシックグランドピアノの鍵盤",
    category: "アート・乗り物",
    humanUrl: "https://images.unsplash.com/photo-1520523839896-523099815b89?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のピアノは白鍵7つに対し黒鍵が2つと3つのグループで並びますが、AI生成は黒鍵が4つ連続で配置されている箇所があり絶対に演奏できない音階配列です。",
    sourceHuman: "楽器スタジオ実写アーカイブ",
    sourceAI: "AI Instrument Render"
  },
  {
    title: "最先端ラボのヒューマノイドロボット",
    category: "アート・乗り物",
    humanUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=800&q=80",
    explanation: "実際の先端ロボット実写は関節部に配線ケーブルやメンテナンス穴が論理的に配置されますが、AIロボットは装甲が関節に干渉して腕が回らず胸ロゴが滲んでいます。",
    sourceHuman: "ロボティクスラボ実写",
    sourceAI: "AI Sci-Fi Mechanical Render"
  },
  {
    title: "スタジアムのサッカーボール",
    category: "アート・乗り物",
    humanUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
    explanation: "実写のボールは正六角形と正五角形の革パネルが均等な張力で縫い合わされていますが、AIボールは五角形パネルが台形に歪みステッチが中央で途切れています。",
    sourceHuman: "スポーツフォトグラフィー",
    sourceAI: "AI Sports Gear Diffusion"
  },
  {
    title: "アンティークなタイプライター",
    category: "アート・乗り物",
    humanUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のタイプライターは活字アームが円弧状に並び中央の印字点へスイングしますが、AI画像はアームが平行に並んでおり打鍵すると互いに衝突する矛盾構造です。",
    sourceHuman: "骨董アーカイブ実写",
    sourceAI: "AI Retro Object Diffusion"
  },
  {
    title: "アナログレコードとターンテーブル",
    category: "アート・乗り物",
    humanUrl: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80",
    explanation: "本物のレコード盤は音溝の同心円が中心穴に対し完全な真円を描きますが、AI画像はレコード溝が渦巻き状にズレておりトーンアーム先端に針が付いていません。",
    sourceHuman: "オーディオサロン実写",
    sourceAI: "AI Music Vinyl Generator"
  },
  {
    title: "木製のクラシックチェスボード",
    category: "アート・乗り物",
    humanUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    aiUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=800&q=80",
    explanation: "実際のチェス盤は「縦8×横8の計64マス」という厳格な公式ルールがありますが、AI生成のボードは横が9マスありナイト（馬駒）の耳が片方しか彫刻されていません。",
    sourceHuman: "ボードゲーム実写アーカイブ",
    sourceAI: "AI Tabletop Diffusion"
  }
];

export function generateGameQuestions(count: number = 10): QuizQuestion[] {
  const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((item, index) => {
    // 完全に50%の確率でAとBにランダム配置
    const isAiA = Math.random() < 0.5;
    
    return {
      id: String(index + 1),
      title: item.title,
      promptText: "この絵はどちらがAIでしょうか？",
      category: item.category,
      imageA: isAiA ? item.aiUrl : item.humanUrl,
      imageB: isAiA ? item.humanUrl : item.aiUrl,
      aiTarget: isAiA ? 'A' : 'B',
      explanation: item.explanation,
      sourceHuman: item.sourceHuman,
      sourceAI: item.sourceAI,
    };
  });
}

// server.tsのインポート互換用エクスポート
export const generateQuizSession = generateGameQuestions;
