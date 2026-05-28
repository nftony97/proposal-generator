import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AppHeader from '../components/proposal/AppHeader';
import ConnectionBar from '../components/proposal/ConnectionBar';
import PipelineWorkspace from '../components/proposal/PipelineWorkspace';
import OutputBuilder from '../components/proposal/OutputBuilder';
import SlidePreview from '../components/proposal/SlidePreview';
import { useProposalState } from '../hooks/useProposalState';
import { STATE_OBJECT } from '../const';

export default function Home() {
  const state = useProposalState();
  const { customStyles, themeConfig } = state;

  return (
    <div className={`min-h-screen flex flex-col ${customStyles.bodyClass}`} style={{ backgroundColor: customStyles.secondaryColor }}>

      <AppHeader
        isPipelineRunning={state.isPipelineRunning}
        customStyles={customStyles}
        runPipeline={state.runPipeline}
      />

      <ConnectionBar
        connections={state.connections}
        toggleConnection={state.toggleConnection}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-10 px-6">
        <div
          className="absolute inset-0 opacity-[0.04] bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663480823141/MG7nnQ4ZEbeykRPB3piYeQ/editorial_hero-gjydcBisDuTmpmc72Z4fav.webp')` }}
        />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
          <div className="lg:col-span-2 space-y-3">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100/80 border border-amber-200 px-3 py-0.5">
              Mid-Market AI Practice POC
            </Badge>
            <h2
              className={`text-3xl md:text-4xl font-semibold tracking-tight leading-tight ${customStyles.headingClass}`}
              style={{ color: customStyles.primaryColor }}
            >
              Sourced Document Intelligence & Pattern Matching.
            </h2>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              Upload any PDF or PPTX design standard, feed raw source spreadsheets or PDFs, and let the orchestrator generate finished, mathematically audited, high-quality deliverables automatically.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pipeline Progress</span>
              <span className="text-sm font-bold" style={{ color: customStyles.primaryColor }}>{state.pipelineProgress}%</span>
            </div>
            <Progress value={state.pipelineProgress} className="h-2 bg-muted" />
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-muted/40 p-2 rounded border border-border/40">
                <div className="font-bold text-foreground">48</div>
                <div className="text-[10px] text-muted-foreground">Group Size</div>
              </div>
              <div className="bg-muted/40 p-2 rounded border border-border/40">
                <div className="font-bold text-foreground">3 Carriers</div>
                <div className="text-[10px] text-muted-foreground">Quotes Parsed</div>
              </div>
              <div className="bg-muted/40 p-2 rounded border border-border/40">
                <div className="font-bold text-emerald-600">PASS</div>
                <div className="text-[10px] text-muted-foreground">QC Status</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 w-full">

        <PipelineWorkspace
          steps={state.steps}
          selectedStep={state.selectedStep}
          setSelectedStep={state.setSelectedStep}
          uploadedStyleFile={state.uploadedStyleFile}
          isExtractingPattern={state.isExtractingPattern}
          customStyles={customStyles}
          handleDragStart={state.handleDragStart}
          handleDragOver={state.handleDragOver}
          handleDrop={state.handleDrop}
          addStep={state.addStep}
          deleteStep={state.deleteStep}
          handleStepNameChange={state.handleStepNameChange}
          handleUploadStyle={state.handleUploadStyle}
        />

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            <div className="xl:col-span-6">
              <OutputBuilder
                themeConfig={themeConfig}
                setThemeConfig={state.setThemeConfig}
                customStyles={customStyles}
                templates={state.templates}
                primaryColors={state.primaryColors}
                secondaryColors={state.secondaryColors}
                fonts={state.fonts}
                customTemplates={state.customTemplates}
                selectedOutputTemplate={state.selectedOutputTemplate}
                setSelectedOutputTemplate={state.setSelectedOutputTemplate}
                setActiveSlideIndex={state.setActiveSlideIndex}
                activeTemplate={state.activeTemplate}
                handleTemplateChange={state.handleTemplateChange}
                toggleSlide={state.toggleSlide}
              />
            </div>

            <div className="xl:col-span-6">
              <SlidePreview
                themeConfig={themeConfig}
                customStyles={customStyles}
                enabledSlides={state.enabledSlides}
                activeSlideIndex={state.activeSlideIndex}
                setActiveSlideIndex={state.setActiveSlideIndex}
                activeTemplate={state.activeTemplate}
                editableTexts={state.editableTexts}
                editingField={state.editingField}
                editValue={state.editValue}
                setEditValue={state.setEditValue}
                uploadedStyleFile={state.uploadedStyleFile}
                startEditing={state.startEditing}
                saveEditedText={state.saveEditedText}
                handleKeyPress={state.handleKeyPress}
              />
            </div>

          </div>

          {/* State Object View */}
          <div className="border border-border/40 rounded-lg overflow-hidden bg-white">
            <div className="bg-muted/40 p-3 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Active Orchestrator State Object</span>
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">JSON Live State</Badge>
            </div>
            <pre className="p-4 text-[11px] font-mono text-muted-foreground bg-muted/5 overflow-x-auto max-h-[150px]">
              {JSON.stringify(STATE_OBJECT, null, 2)}
            </pre>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 px-6 bg-white dark:bg-black mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground" style={{ color: customStyles.primaryColor }}>Evans National</span>
            <span>• Employee Benefits & AI Strategy</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#help" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#terms" className="hover:text-foreground transition-colors">Practice Governance</a>
            <a href="#support" className="hover:text-foreground transition-colors">Support Portal</a>
          </div>
          <div>
            <span>Powered by <strong>LYT Practice Platform</strong> © 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
