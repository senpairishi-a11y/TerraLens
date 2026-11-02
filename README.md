# TerraLens

**LST · Spectral indices · LULC for India: a no-code Google Earth Engine web app**

TerraLens lets researchers and students map land surface temperature (LST), compute spectral indices and run land-cover classification for any district or custom area in India, without writing code or installing desktop GIS software.

- **Live app:** https://qgis-map-api-460018.projects.earthengine.app/view/terralens
- **Current version:** v1.9.3
- **Author:** Krishnananda Deka ([ORCID 0009-0006-1501-7261](https://orcid.org/0009-0006-1501-7261))
- **Updates:** Telegram channel @TERRALENS_KD (https://t.me/terralens_kd)

---

## What it does

| Module | What you get |
|---|---|
| **Land surface temperature** | Landsat 5/7/8/9 Collection 2 Level-2 surface temperature (°C), with cloud, shadow and quality screening |
| **Cloud-gap filling (two options)** | (1) **ST-DCA**, an ERA5-Land-based reconstruction at 30 m, and (2) **MODIS-calibrated hybrid** (1 km) for monsoon-season cloud cover. A flag band records which source filled each pixel |
| **Spectral indices** | 15 indices: NDVI, NDBI, BSI, NDWI, MNDWI, EVI, SAVI, NDMI, NBR, GNDVI, MSAVI, UI, IBI, BUI, AWEI. Select by day, month or year |
| **LULC classification** | Random Forest in the browser with user-defined classes. Overall accuracy and Kappa shown on screen. Users can mark wrongly classified pixels to retrain and improve the model |
| **Data-quality report** | R² and RMSE are reported with each download so users can judge how reliable the data is before using it |
| **Downloads** | Rasters and tables exported from the app |

Study areas can be chosen from state/district boundaries (FAO GAUL) or a custom AOI.

---

## ST-DCA: how the cloud-gap filling works

ST-DCA reconstructs LST under clouds for each Landsat scene:

1. **Time-matched reanalysis.** Each Landsat scene is paired with the ERA5-Land hourly skin temperature closest to its overpass (within ±60 minutes).
2. **Residual learning with a cloud-edge buffer.** The Landsat minus ERA5-Land residual is learned only from clear pixels at least 150 m away from cloud and shadow (automatically narrowed on very cloudy scenes), to avoid the cold-halo bias near cloud edges.
3. **Multi-scale blending.** Local (about 3 km) and regional (8 km) residuals are blended, with a scene-mean bias fallback so large gaps do not fall back to raw ERA5-Land values.
4. **30 m texture restoration.** Fine-scale texture is added through a regression on same-month NDVI, MNDWI, elevation (SRTM) and the annual clear-sky LST anomaly.
5. **Cross-scene harmonisation.** Scenes in a monthly composite are aligned to the monthly level, anchored on ERA5-Land, to avoid seams at scene edges.
6. **Hold-out self-calibration.** About 11% of clear pixels are hidden in roughly 1 km blocks, predicted from the rest, and the mean error is removed.

An in-app **artificial-cloud test** hides part of the clear pixels of a scene as fake clouds and reports how well they are reconstructed.

> **Status:** ST-DCA is under active development. A full independent validation against baseline methods is in progress. Please treat outputs as research-grade estimates and check the on-screen quality report.

---

## How to run it yourself

1. Open the [Earth Engine Code Editor](https://code.earthengine.google.com) (free Google Earth Engine account required).
2. Create a new script and paste the contents of `TerraLens_v1_9_3.js`.
3. Click **Run**.
4. To publish your own copy: **Apps → New App**.

## Data sources (as used in the code)

- Landsat 5/7/8/9 Collection 2 Level-2 (USGS)
- MODIS MOD11A1 / MYD11A1 LST (v061)
- ERA5-Land hourly (ECMWF / Copernicus)
- SRTM 30 m elevation (USGS)
- Sentinel-2 SR Harmonized, Sentinel-1 GRD (Copernicus)
- FAO GAUL 2015 administrative boundaries
- Reference land-cover products: Dynamic World, ESA WorldCover, MODIS MCD12Q1

## Known limitations

- Runs inside Google Earth Engine, so it is subject to GEE compute and memory limits. Very large areas may time out. Use a smaller area or shorter period.
- ERA5-Land is coarse (about 9 km). ST-DCA depends on the residual and covariates to recover 30 m detail and may be less reliable in very heterogeneous areas or with very few clear pixels.
- Landsat overpass is mid-morning, so results describe that time of day only.
- Monsoon composites with very few clear scenes have higher uncertainty. Check the R², RMSE and flag band.

## Citation

If you use TerraLens in your work, please cite:

> Deka, K. (2026). *TerraLens: a Google Earth Engine web app for land surface temperature, spectral indices and LULC mapping in India* (v1.9.3) [Software]. GitHub. DOI: *(https://doi.org/10.5281/zenodo.23898056)*

## What's new in v1.9.3

- Cloud-edge buffer: ST-DCA learns the residual only from clear pixels at least 150 m from clouds and shadows
- Self-calibration: hold-out bias estimation and removal, no manual tuning on a new AOI
- Cross-scene harmonisation of monthly composites (ERA5-anchored)
- Spectral covariate sharpening using NDVI, MNDWI, elevation and annual LST anomaly
- Multi-scale residual blending (local + 8 km regional) with scene-mean bias fallback
- Auto-scaled 30 m texture weight
- Auto-contrast LST stretch (2nd–98th percentile)
- Simpler interface: custom AOI defaults to outline-only; advanced ST-DCA sliders in an optional toggle

## License

MIT License. See the `LICENSE` file. (Change this if you prefer different terms.)

## Contact

Krishnananda Deka, Mangaldai, Assam, India · senpairishi@gmail.com
