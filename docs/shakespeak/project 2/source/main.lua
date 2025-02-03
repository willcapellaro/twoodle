import "CoreLibs/object"
import "CoreLibs/graphics"
import "CoreLibs/sprites"
import "CoreLibs/timer"

local gfx <const> = playdate.graphics
local display <const> = playdate.display

-- Game state
local currentLine = 1
local showAlternate = false
local alternateVersion = 1
local crankAccumulator = 0

-- Load script data
local scriptData = {
    title = "Hamlet",
    act = 5,
    scene = 2,
    lines = {
        -- Lines will be loaded from script.json
    }
}

-- Initialize game
function init()
    -- Set up display
    gfx.setBackgroundColor(gfx.kColorWhite)
    playdate.setRefreshRate(50)

    -- Load script data from JSON
    local scriptFile = playdate.file.open("scripts/hamlet.json")
    if scriptFile then
        local scriptJson = scriptFile:read(999999)
        scriptFile:close()
        scriptData.lines = json.decode(scriptJson).lines
    end
end

-- Get context lines (3 previous lines)
function getContextLines()
    local lines = {}
    for i = math.max(1, currentLine - 3), currentLine - 1 do
        table.insert(lines, scriptData.lines[i])
    end
    return lines
end

-- Draw the screen
function drawScreen()
    gfx.clear()

    -- Draw title
    gfx.setFont(gfx.font.kVariantBold)
    local title = string.format("%s - Act %d, Scene %d", scriptData.title, scriptData.act, scriptData.scene)
    gfx.drawText(title, 10, 10)

    -- Draw context lines
    local contextLines = getContextLines()
    local y = 40
    gfx.setFont(gfx.font.kVariantNormal)
    for _, line in ipairs(contextLines) do
        local text = line.speaker .. ": " .. (showAlternate and line.alternate[alternateVersion] or line.original)
        gfx.drawTextInRect(text, 10, y, 380, 30)
        y += 20
    end

    -- Draw current line with highlight
    gfx.setFont(gfx.font.kVariantBold)
    local currentText = scriptData.lines[currentLine].speaker .. ": " .. 
        (showAlternate and scriptData.lines[currentLine].alternate[alternateVersion] or scriptData.lines[currentLine].original)
    gfx.drawRect(5, y, 390, 40)
    gfx.drawTextInRect(currentText, 10, y + 5, 380, 35)

    -- Draw next line preview (if available)
    if currentLine < #scriptData.lines then
        y += 45
        gfx.setFont(gfx.font.kVariantNormal)
        local nextLine = scriptData.lines[currentLine + 1]
        local previewText = nextLine.speaker .. ": " .. string.sub(
            showAlternate and nextLine.alternate[alternateVersion] or nextLine.original,
            1, 30
        ) .. "..."
        gfx.drawTextInRect(previewText, 10, y, 380, 20)
    end

    -- Draw line counter
    local counter = string.format("Line %d/%d", currentLine, #scriptData.lines)
    gfx.drawText(counter, 10, 220)

    -- Draw controls
    gfx.drawText("A: Toggle Alt", 280, 210)
    gfx.drawText("B: Original", 280, 220)
end

-- Update game state
function playdate.update()
    -- Handle crank
    local change = playdate.getCrankChange()
    if change ~= 0 then
        crankAccumulator += change
        if math.abs(crankAccumulator) >= 30 then
            if crankAccumulator > 0 then
                currentLine = math.min(currentLine + 1, #scriptData.lines)
            else
                currentLine = math.max(currentLine - 1, 1)
            end
            crankAccumulator = 0
        end
    end

    -- Handle buttons
    if playdate.buttonJustPressed(playdate.kButtonA) then
        if showAlternate then
            alternateVersion = alternateVersion == 1 and 2 or 1
        else
            showAlternate = true
            alternateVersion = 1
        end
    elseif playdate.buttonJustPressed(playdate.kButtonB) then
        showAlternate = false
        alternateVersion = 1
    elseif playdate.buttonJustPressed(playdate.kButtonUp) then
        currentLine = math.max(currentLine - 1, 1)
    elseif playdate.buttonJustPressed(playdate.kButtonDown) then
        currentLine = math.min(currentLine + 1, #scriptData.lines)
    end

    drawScreen()
end

init()