$html = @()

# Galleries Section
$html += '  <!-- ========== CATEGORIES (GALLERY) ========== -->'
$html += '  <section class="projects" id="projects">'
$html += '    <div class="section-intro">'
$html += '      <span class="section-eyebrow">✦ Selected Work</span>'
$html += '      <h2 class="section-title">Design <em>Gallery</em></h2>'
$html += '    </div>'

# Tabs for Medium
$html += '    <div class="gallery-tabs" style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; padding: 0 clamp(1.5rem, 4vw, 3.5rem); flex-wrap: wrap;">'
$html += '      <button class="gallery-tab active" data-medium="render">Render Images</button>'
$html += '      <button class="gallery-tab" data-medium="real">Real Images</button>'
$html += '      <button class="gallery-tab" data-medium="screenshot">Screenshots</button>'
$html += '    </div>'

$html += '    <!-- RENDER IMAGES -->'
$html += '    <div class="gallery-medium-container active" id="medium-render">'

# Filters for Rooms
$html += '      <div class="room-filters" style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap; padding: 0 clamp(1.5rem, 4vw, 3.5rem);">'
$html += '        <button class="room-filter active" data-room="bedroom">Bedroom</button>'
$html += '        <button class="room-filter" data-room="crockery">Crockery</button>'
$html += '        <button class="room-filter" data-room="foyer">Foyer</button>'
$html += '        <button class="room-filter" data-room="kitchen">Kitchen</button>'
$html += '        <button class="room-filter" data-room="living_room">Living Room</button>'
$html += '        <button class="room-filter" data-room="pooja_room">Pooja room</button>'
$html += '        <button class="room-filter" data-room="washroom">Washroom</button>'
$html += '        <button class="room-filter" data-room="all">All</button>'
$html += '      </div>'

$html += '      <div class="project-gallery categorized-gallery" style="padding: 0 clamp(1.5rem, 4vw, 3.5rem); max-width: 1400px; margin: 0 auto;">'

$dirs = Get-ChildItem -Path "Portfolio_media\Render_Images" -Directory
foreach ($dir in $dirs) {
    $roomId = $dir.Name.ToLower()
    $roomName = $dir.Name -replace '_', ' '
    $images = Get-ChildItem -Path $dir.FullName -File
    foreach ($img in $images) {
        $path = "Portfolio_media/Render_Images/" + $dir.Name + "/" + $img.Name
        $html += '        <div class="g-item room-item" data-room="' + $roomId + '">'
        $html += '          <img src="' + $path + '" alt="' + $roomName + '" loading="lazy" />'
        $html += '          <span class="g-cap">' + $roomName + '</span>'
        $html += '        </div>'
    }
}
$html += '      </div>'
$html += '    </div>'

$html += '    <!-- REAL IMAGES -->'
$html += '    <div class="gallery-medium-container" id="medium-real" style="display: none; text-align: center; padding: 4rem 1.5rem; color: var(--text-muted);">'
$html += '      <p><em>Coming soon...</em></p>'
$html += '    </div>'

$html += '    <!-- SCREENSHOTS -->'
$html += '    <div class="gallery-medium-container" id="medium-screenshot" style="display: none; text-align: center; padding: 4rem 1.5rem; color: var(--text-muted);">'
$html += '      <p><em>Coming soon...</em></p>'
$html += '    </div>'
$html += '  </section>'

# 2D Plans Section
$html += '  <!-- ========== 2D PLANS ========== -->'
$html += '  <section class="projects" id="plans" style="padding-top: 4rem;">'
$html += '    <div class="section-intro">'
$html += '      <span class="section-eyebrow">✦ Technical Drawings</span>'
$html += '      <h2 class="section-title">2D <em>Plans</em></h2>'
$html += '      <p class="section-sub">Detailed floor plans, elevations, and technical drawings.</p>'
$html += '    </div>'
$html += '    <div class="plans-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; padding: 0 clamp(1.5rem, 4vw, 3.5rem); max-width: 1200px; margin: 0 auto;">'

$plans = Get-ChildItem -Path "Portfolio_media\2d_Plans" -File
foreach ($plan in $plans) {
    $name = $plan.Name -replace '\.pdf$', '' -replace '_', ' '
    $path = "Portfolio_media/2d_Plans/" + $plan.Name
    $html += '      <a href="' + $path + '" target="_blank" class="plan-card" style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: var(--bg-warm); border: 1px solid var(--border); border-radius: 8px; transition: all 0.3s ease;">'
    $html += '        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    $html += '        <span style="font-weight: 500; font-size: 0.9rem; color: var(--cream);">' + $name + '</span>'
    $html += '      </a>'
}

$html += '    </div>'
$html += '  </section>'

$html | Set-Content -Encoding UTF8 "gallery_output.txt"
