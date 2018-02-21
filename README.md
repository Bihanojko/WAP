# Zadani

Společná část popisu:
Cílem projektu je implementace zvolené varianty zadání v jazyce JavaScript.
Zvolené zadání implementujte tak, aby byl kód plně funkční nejméně v prohlížečích Internet Explorer nebo Microsoft Edge, Firefox a Chrome v aktuálních verzích.
U zadání označených "prvek stránky" zajistěte, aby daný prvek mohl být vložen do libovolného HTML dokumentu a to případně i vícekrát nezávisle na sobě.
Implementace nesmí vyžadovat úpravy HTML dokumentu, se kterým se pracuje, kromě vložení vytvořeného skriptu do hlavičky dokumentu a případně volání implementovaných funkcí na začátku nebo na konci dokumentu. V případě zadání "Tabulkový kalkulátor" je povoleno vložit skript volající implementovanou funkci, na libovolná místa dokumentu, kde se výsledná tabulka má zobrazit. Nelze vyžadovat přidání zvláštních pomocných elementů na různá místa dokumentu, atributů pro obsluhu událostí apod. mimo elementů uvedených v zadání. Na druhou stranu skript může v rámci své inicializace modifikovat aktuální dokument a vytvořit si sám všechny struktury, které jsou k jeho běhu zapotřebí.
Ve všech případech definujte vzhled všech zobrazovaných částí ve zvláštním externím stylovém předpise CSS opatřeném komentáři tak, aby uživatel mohl přizpůsobit vzhled řešení svým potřebám (zejména použité barvy, písmo, velikosti).
Součástí odevzdaného řešení dále musí být
    - Ukázkový HTML dokument demo.html demonstrující funkčnost implementovaného řešení
    - Soubor navod.html obsahující stručný návod k použití v dokumentu (pro programátora, nikoliv pro koncového uživatele)
Cílem projektu je seznámit se detailně s funkcí klientského JavaScriptu v prohlížečích a implementačními detaily. Celý kód řešení proto musí být původní, použití hotových knihoven, frameworků nebo jejich částí není povoleno.
Odevzdává se jeden soubor ve formátu ZIP pojmenovaný vaslogin.zip obsahující všechny soubory řešení. Odevzdání probíhá přes IS FIT.

Popis varianty:
Mějme libovolný HTML dokument obsahující v textu časové údaje zapsané pomocí HTML5 elementu time s atributem datetime, který obsahuje přesný časový údaj (datum a čas). Samotný obsah elementu time je libovolný (např. tentýž čas v čitelné podobě). Každý takový prvek bude mít také atribut title, který bude obsahovat popis, co se v daný čas čas odehrálo (např. title="vložení požadavku #23"). Dále bude kdekoliv v dokumentu jeden prázdný element div class="controls". Vytvořte skript, který
    - Zobrazí v části controls ovládací prvky, které umožní přepínat zobrazení časových údajů buď absolutně (konkrétní datum a čas), tak relativně (např. před 6 hodinami). V případě relativních časů se údaje automaticky aktualizují např. 1x za minutu.
    - Dále v části controls zobrazí časovou osu se všemi časovými údaji a jejich popisem. Rozložení údajů na časové ose by mělo proporčně odpovídat relativním vzdálenostem mezi časovými údaji, tzn. bližší časové údaje jsou na ose blízko sebe.
