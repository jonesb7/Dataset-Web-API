<svg viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
  <!-- Define styles -->
  <defs>
    <style>
      .entity-box { fill: #e8f4f8; stroke: #333; stroke-width: 2; }
      .junction-box { fill: #f0e6f8; stroke: #333; stroke-width: 2; }
      .lookup-box { fill: #fff9e6; stroke: #333; stroke-width: 2; }
      .text-title { font-size: 14px; font-weight: bold; }
      .text-attr { font-size: 12px; }
      .text-pk { font-weight: bold; }
      .text-fk { font-style: italic; }
      .line { stroke: #333; stroke-width: 2.5; fill: none; }
      .cardinality { font-size: 14px; font-weight: bold; fill: #d00; }
      .cardinality-bg { fill: white; stroke: #d00; stroke-width: 1; }
      .relationship-label { font-size: 12px; fill: #333; font-weight: bold; background: white; }
    </style>
  </defs>

  <!-- TOP ROW: Primary Entities -->
  <!-- Collection (Top Left) -->
  <rect x="50" y="30" width="180" height="120" class="entity-box"/>
  <line x1="50" y1="65" x2="230" y2="65" class="line"/>
  <text x="60" y="60" class="text-title">Collection</text>
  <text x="60" y="80" class="text-attr"><tspan class="text-pk">collection_id (PK)</tspan></text>
  <text x="60" y="95" class="text-attr">name</text>
  <text x="60" y="110" class="text-attr">description</text>
  <text x="60" y="125" class="text-attr">created_at</text>

  <!-- Genre (Top Center-Left) -->
  <rect x="350" y="30" width="180" height="120" class="entity-box"/>
  <line x1="350" y1="65" x2="530" y2="65" class="line"/>
  <text x="360" y="60" class="text-title">Genre</text>
  <text x="360" y="80" class="text-attr"><tspan class="text-pk">genre_id (PK)</tspan></text>
  <text x="360" y="95" class="text-attr">name</text>
  <text x="360" y="110" class="text-attr">description</text>
  <text x="360" y="125" class="text-attr">created_at</text>

  <!-- Person (Top Center-Right) -->
  <rect x="650" y="30" width="200" height="120" class="entity-box"/>
  <line x1="650" y1="65" x2="850" y2="65" class="line"/>
  <text x="660" y="60" class="text-title">Person</text>
  <text x="660" y="80" class="text-attr"><tspan class="text-pk">person_id (PK)</tspan></text>
  <text x="660" y="95" class="text-attr">name</text>
  <text x="660" y="110" class="text-attr">profile_url</text>
  <text x="660" y="125" class="text-attr">biography</text>

  <!-- Studio (Top Right) -->
  <rect x="1000" y="30" width="200" height="120" class="entity-box"/>
  <line x1="1000" y1="65" x2="1200" y2="65" class="line"/>
  <text x="1010" y="60" class="text-title">Studio</text>
  <text x="1010" y="80" class="text-attr"><tspan class="text-pk">studio_id (PK)</tspan></text>
  <text x="1010" y="95" class="text-attr">name</text>
  <text x="1010" y="110" class="text-attr">country</text>
  <text x="1010" y="125" class="text-attr">logo_url</text>

  <!-- MIDDLE: Movie (Central Entity) -->
  <rect x="600" y="250" width="300" height="300" class="entity-box"/>
  <line x1="600" y1="285" x2="900" y2="285" class="line"/>
  <text x="610" y="280" class="text-title">Movie</text>
  <text x="610" y="300" class="text-attr"><tspan class="text-pk">movie_id (PK)</tspan></text>
  <text x="610" y="318" class="text-attr">title</text>
  <text x="610" y="336" class="text-attr">original_title</text>
  <text x="610" y="354" class="text-attr">release_date</text>
  <text x="610" y="372" class="text-attr">runtime (minutes)</text>
  <text x="610" y="390" class="text-attr">budget</text>
  <text x="610" y="408" class="text-attr">revenue</text>
  <text x="610" y="426" class="text-attr">mpa_rating</text>
  <text x="610" y="444" class="text-attr">overview</text>
  <text x="610" y="462" class="text-attr">poster_url</text>
  <text x="610" y="480" class="text-attr">backdrop_url</text>
  <text x="610" y="498" class="text-attr"><tspan class="text-fk">collection_id (FK)</tspan></text>
  <text x="610" y="516" class="text-attr"><tspan class="text-fk">studio_id (FK)</tspan></text>
  <text x="610" y="534" class="text-attr">created_at</text>

  <!-- BOTTOM ROW: Junction Tables -->
  <!-- Movie_Genre (Bottom Left) -->
  <rect x="250" y="650" width="200" height="130" class="junction-box"/>
  <line x1="250" y1="685" x2="450" y2="685" class="line"/>
  <text x="260" y="680" class="text-title">Movie_Genre</text>
  <text x="260" y="700" class="text-attr"><tspan class="text-pk">movie_genre_id (PK)</tspan></text>
  <text x="260" y="718" class="text-attr"><tspan class="text-fk">movie_id (FK)</tspan></text>
  <text x="260" y="736" class="text-attr"><tspan class="text-fk">genre_id (FK)</tspan></text>
  <text x="260" y="754" class="text-attr">created_at</text>

  <!-- Movie_Cast (Bottom Center) -->
  <rect x="600" y="650" width="200" height="150" class="junction-box"/>
  <line x1="600" y1="685" x2="800" y2="685" class="line"/>
  <text x="610" y="680" class="text-title">Movie_Cast</text>
  <text x="610" y="700" class="text-attr"><tspan class="text-pk">cast_id (PK)</tspan></text>
  <text x="610" y="718" class="text-attr"><tspan class="text-fk">movie_id (FK)</tspan></text>
  <text x="610" y="736" class="text-attr"><tspan class="text-fk">person_id (FK)</tspan></text>
  <text x="610" y="754" class="text-attr">character_name</text>
  <text x="610" y="772" class="text-attr">cast_order</text>

  <!-- Movie_Crew (Bottom Right) -->
  <rect x="950" y="650" width="220" height="150" class="junction-box"/>
  <line x1="950" y1="685" x2="1170" y2="685" class="line"/>
  <text x="960" y="680" class="text-title">Movie_Crew</text>
  <text x="960" y="700" class="text-attr"><tspan class="text-pk">crew_id (PK)</tspan></text>
  <text x="960" y="718" class="text-attr"><tspan class="text-fk">movie_id (FK)</tspan></text>
  <text x="960" y="736" class="text-attr"><tspan class="text-fk">person_id (FK)</tspan></text>
  <text x="960" y="754" class="text-attr"><tspan class="text-fk">role_id (FK)</tspan></text>
  <text x="960" y="772" class="text-attr">department</text>

  <!-- Role Lookup Table (Bottom Far Right) -->
  <rect x="1250" y="650" width="200" height="130" class="lookup-box"/>
  <line x1="1250" y1="685" x2="1450" y2="685" class="line"/>
  <text x="1260" y="680" class="text-title">Role</text>
  <text x="1260" y="700" class="text-attr"><tspan class="text-pk">role_id (PK)</tspan></text>
  <text x="1260" y="718" class="text-attr">title</text>
  <text x="1260" y="736" class="text-attr">description</text>
  <text x="1260" y="754" class="text-attr">created_at</text>

  <!-- RELATIONSHIPS WITH BETTER LABELING -->
  
  <!-- 1: Collection to Movie (1:N) -->
  <line x1="230" y1="90" x2="600" y2="350" class="line" stroke="#0066cc" stroke-width="3"/>
  <!-- "1" circle at Collection end -->
  <circle cx="240" cy="100" r="12" class="cardinality-bg"/>
  <text x="234" y="107" class="cardinality">1</text>
  <!-- "N" circle at Movie end -->
  <circle cx="590" cy="340" r="12" class="cardinality-bg"/>
  <text x="582" y="347" class="cardinality">N</text>
  <rect x="350" y="175" width="160" height="30" fill="white" stroke="#0066cc" stroke-width="1" rx="3"/>
  <text x="365" y="197" class="relationship-label">Collection→Movie</text>

  <!-- 2: Genre to Movie_Genre (1:N) -->
  <line x1="440" y1="150" x2="350" y2="650" class="line" stroke="#cc0066" stroke-width="3"/>
  <!-- "1" circle at Genre end -->
  <circle cx="430" cy="160" r="12" class="cardinality-bg" stroke="#cc0066"/>
  <text x="424" y="167" class="cardinality" fill="#cc0066">1</text>
  <!-- "N" circle at Movie_Genre end -->
  <circle cx="360" cy="640" r="12" class="cardinality-bg" stroke="#cc0066"/>
  <text x="352" y="647" class="cardinality" fill="#cc0066">N</text>
  <rect x="420" y="380" width="140" height="30" fill="white" stroke="#cc0066" stroke-width="1" rx="3"/>
  <text x="425" y="402" class="relationship-label" fill="#cc0066">Genre→Movie_Genre</text>

  <!-- 3: Movie to Movie_Genre (1:N) -->
  <line x1="650" y1="550" x2="400" y2="650" class="line" stroke="#00aa00" stroke-width="3"/>
  <!-- "1" circle at Movie end -->
  <circle cx="640" cy="540" r="12" class="cardinality-bg" stroke="#00aa00"/>
  <text x="634" y="547" class="cardinality" fill="#00aa00">1</text>
  <!-- "N" circle at Movie_Genre end -->
  <circle cx="410" cy="660" r="12" class="cardinality-bg" stroke="#00aa00"/>
  <text x="402" y="667" class="cardinality" fill="#00aa00">N</text>
  <rect x="490" y="580" width="140" height="30" fill="white" stroke="#00aa00" stroke-width="1" rx="3"/>
  <text x="500" y="602" class="relationship-label" fill="#00aa00">Movie→Movie_Genre</text>

  <!-- 4: Movie to Movie_Cast (1:N) -->
  <line x1="750" y1="550" x2="700" y2="650" class="line" stroke="#ff6600" stroke-width="3"/>
  <!-- "1" circle at Movie end -->
  <circle cx="760" cy="540" r="12" class="cardinality-bg" stroke="#ff6600"/>
  <text x="754" y="547" class="cardinality" fill="#ff6600">1</text>
  <!-- "N" circle at Movie_Cast end -->
  <circle cx="690" cy="660" r="12" class="cardinality-bg" stroke="#ff6600"/>
  <text x="682" y="667" class="cardinality" fill="#ff6600">N</text>
  <rect x="720" y="580" width="120" height="30" fill="white" stroke="#ff6600" stroke-width="1" rx="3"/>
  <text x="730" y="602" class="relationship-label" fill="#ff6600">Movie→Cast</text>

  <!-- 5: Person to Movie_Cast (1:N) -->
  <line x1="750" y1="150" x2="700" y2="650" class="line" stroke="#9900cc" stroke-width="3"/>
  <!-- "1" circle at Person end -->
  <circle cx="760" cy="160" r="12" class="cardinality-bg" stroke="#9900cc"/>
  <text x="754" y="167" class="cardinality" fill="#9900cc">1</text>
  <!-- "N" circle at Movie_Cast end -->
  <circle cx="690" cy="640" r="12" class="cardinality-bg" stroke="#9900cc"/>
  <text x="682" y="647" class="cardinality" fill="#9900cc">N</text>
  <rect x="770" y="380" width="130" height="30" fill="white" stroke="#9900cc" stroke-width="1" rx="3"/>
  <text x="775" y="402" class="relationship-label" fill="#9900cc">Person→Cast</text>

  <!-- 6: Movie to Movie_Crew (1:N) -->
  <line x1="850" y1="550" x2="1000" y2="650" class="line" stroke="#ff0000" stroke-width="3"/>
  <!-- "1" circle at Movie end -->
  <circle cx="860" cy="540" r="12" class="cardinality-bg" stroke="#ff0000"/>
  <text x="854" y="547" class="cardinality" fill="#ff0000">1</text>
  <!-- "N" circle at Movie_Crew end -->
  <circle cx="990" cy="660" r="12" class="cardinality-bg" stroke="#ff0000"/>
  <text x="982" y="667" class="cardinality" fill="#ff0000">N</text>
  <rect x="900" y="580" width="130" height="30" fill="white" stroke="#ff0000" stroke-width="1" rx="3"/>
  <text x="905" y="602" class="relationship-label" fill="#ff0000">Movie→Crew</text>

  <!-- 7: Person to Movie_Crew (1:N) -->
  <line x1="800" y1="150" x2="1050" y2="650" class="line" stroke="#00cccc" stroke-width="3"/>
  <!-- "1" circle at Person end -->
  <circle cx="810" cy="160" r="12" class="cardinality-bg" stroke="#00cccc"/>
  <text x="804" y="167" class="cardinality" fill="#00cccc">1</text>
  <!-- "N" circle at Movie_Crew end -->
  <circle cx="1040" cy="640" r="12" class="cardinality-bg" stroke="#00cccc"/>
  <text x="1032" y="647" class="cardinality" fill="#00cccc">N</text>
  <rect x="870" y="380" width="140" height="30" fill="white" stroke="#00cccc" stroke-width="1" rx="3"/>
  <text x="875" y="402" class="relationship-label" fill="#00cccc">Person→Crew</text>

  <!-- 8: Role to Movie_Crew (1:N) -->
  <line x1="1250" y1="715" x2="1170" y2="715" class="line" stroke="#333333" stroke-width="3"/>
  <!-- "1" circle at Role end -->
  <circle cx="1240" cy="715" r="12" class="cardinality-bg"/>
  <text x="1234" y="722" class="cardinality">1</text>
  <!-- "N" circle at Movie_Crew end -->
  <circle cx="1180" cy="715" r="12" class="cardinality-bg"/>
  <text x="1172" y="722" class="cardinality">N</text>
  <rect x="1180" y="695" width="100" height="25" fill="white" stroke="#333" stroke-width="1" rx="3"/>
  <text x="1190" y="713" class="relationship-label">Role→Crew</text>

  <!-- 9: Studio to Movie (1:N) -->
  <line x1="1100" y1="150" x2="800" y2="250" class="line" stroke="#006633" stroke-width="3"/>
  <!-- "1" circle at Studio end -->
  <circle cx="1090" cy="160" r="12" class="cardinality-bg" stroke="#006633"/>
  <text x="1084" y="167" class="cardinality" fill="#006633">1</text>
  <!-- "N" circle at Movie end -->
  <circle cx="810" cy="240" r="12" class="cardinality-bg" stroke="#006633"/>
  <text x="802" y="247" class="cardinality" fill="#006633">N</text>
  <rect x="930" y="170" width="120" height="30" fill="white" stroke="#006633" stroke-width="1" rx="3"/>
  <text x="935" y="192" class="relationship-label" fill="#006633">Studio→Movie</text>

  <!-- LEGEND -->
  <rect x="50" y="850" width="500" height="120" fill="#f5f5f5" stroke="#999" stroke-width="2" rx="5"/>
  <text x="65" y="875" class="text-title">Legend:</text>
  <text x="65" y="895" class="text-attr"><tspan class="text-pk">PK</tspan> = Primary Key | <tspan class="text-fk">FK</tspan> = Foreign Key</text>
  <text x="65" y="910" class="text-attr">🔵 Blue Box = Entity | 🔵 Purple Box = Junction Table | 🔵 Yellow Box = Lookup Table</text>
  <text x="65" y="930" class="text-attr">Each colored line shows ONE relationship. <tspan class="text-pk">1</tspan> = one record | <tspan class="text-pk">N</tspan> = many records</text>
</svg>