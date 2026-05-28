import React, { useRef, useState } from 'react';
import { Presentation, Edit3, Download, RefreshCw as LoopIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ThemeConfig, OutputTemplate } from '../../const';

interface SlidePreviewProps {
  themeConfig: ThemeConfig;
  customStyles: { primaryColor: string; secondaryColor: string; headingClass: string };
  enabledSlides: OutputTemplate['slides'];
  activeSlideIndex: number;
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  activeTemplate: OutputTemplate;
  editableTexts: Record<string, { title?: string; subtitle?: string; body?: string }>;
  editingField: { slideId: string; field: 'title' | 'subtitle' | 'body' } | null;
  editValue: string;
  setEditValue: (v: string) => void;
  uploadedStyleFile: string | null;
  startEditing: (slideId: string, field: 'title' | 'subtitle' | 'body', defaultValue: string) => void;
  saveEditedText: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export default function SlidePreview({
  themeConfig, customStyles,
  enabledSlides, activeSlideIndex, setActiveSlideIndex, activeTemplate,
  editableTexts, editingField, editValue, setEditValue, uploadedStyleFile,
  startEditing, saveEditedText, handleKeyPress,
}: SlidePreviewProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const currentSlide = enabledSlides[activeSlideIndex % enabledSlides.length];

  async function downloadDraftPDF() {
    if (!slideRef.current || isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    toast.info('Compiling slide deck with custom overrides & styles...');
    try {
      await new Promise(r => setTimeout(r, 500));
      const canvas = await html2canvas(slideRef.current, {
        scale: 2, useCORS: true,
        backgroundColor: themeConfig.secondaryColor, logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      const fileName = `${activeTemplate.name.replace(/\s+/g, '_')}_Draft.pdf`;
      pdf.save(fileName);
      toast.success(`Draft PDF downloaded successfully: ${fileName}`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to compile slide into PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  function EditableField({
    slideId, field, defaultValue,
    className, style, tag: Tag = 'p',
  }: {
    slideId: string; field: 'title' | 'subtitle' | 'body'; defaultValue: string;
    className?: string; style?: React.CSSProperties; tag?: 'h2' | 'h3' | 'p';
  }) {
    const isEditing = editingField?.slideId === slideId && editingField?.field === field;
    const isTextArea = field === 'body';

    if (isEditing) {
      const sharedProps = {
        value: editValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditValue(e.target.value),
        onBlur: saveEditedText,
        onKeyDown: handleKeyPress,
        autoFocus: true,
        className: 'bg-white border border-primary/40 rounded px-1.5 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-primary text-sm',
        style,
      };
      return (
        <div className="flex items-center gap-1.5 w-full">
          {isTextArea
            ? <textarea {...sharedProps} rows={2} />
            : <input type="text" {...sharedProps} />}
          <Button size="sm" onClick={saveEditedText} className="h-6 px-2 text-[10px]">Save</Button>
        </div>
      );
    }

    return (
      <Tag
        onDoubleClick={() => startEditing(slideId, field, defaultValue)}
        className={`${className} hover:bg-amber-50 hover:ring-1 hover:ring-amber-200/80 cursor-text rounded px-1 group/field relative`}
        style={style}
        title="Double click to edit"
      >
        {editableTexts[slideId]?.[field] ?? defaultValue}
        <Edit3 className="h-3 w-3 text-amber-500 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/field:opacity-100 transition-opacity" />
      </Tag>
    );
  }

  return (
    <Card className="shadow-sm border-border/60 bg-white/95 relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
      <CardHeader className="pb-2 border-b border-border/40 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Presentation className="h-4 w-4" style={{ color: customStyles.primaryColor }} />
            <CardTitle className={`text-sm font-bold tracking-tight ${customStyles.headingClass}`}>
              Real-time Slide Preview
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[9px] uppercase font-bold bg-white border-emerald-500/30 text-emerald-700 flex items-center gap-1">
            <Edit3 className="h-2.5 w-2.5 text-emerald-600 animate-pulse" />
            Double-Click to Edit
          </Badge>
        </div>
      </CardHeader>

      {/* Captured by html2canvas */}
      <div ref={slideRef}>
        <CardContent className="p-6 flex-1 flex flex-col justify-between" style={{ backgroundColor: themeConfig.secondaryColor }}>
          {enabledSlides.length > 0 && currentSlide ? (
            <div className="flex-1 flex flex-col justify-between min-h-[280px]">

              {/* Slide Header */}
              <div className="flex justify-between items-start border-b border-slate-200/60 pb-3">
                <div className="flex-1 mr-4">
                  <EditableField
                    slideId={currentSlide.id} field="title"
                    defaultValue={currentSlide.title}
                    tag="h3"
                    className="text-lg font-bold tracking-tight leading-tight"
                    style={{ fontFamily: themeConfig.headingFont, color: themeConfig.primaryColor }}
                  />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Acme Corporation • Effective: July 1, 2026</p>
                </div>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480823141/MG7nnQ4ZEbeykRPB3piYeQ/evans_logo-Mz9STXvvEQpdrTFHqSQDuw.png"
                  alt="Evans Logo" className="h-6 w-auto object-contain"
                />
              </div>

              {/* Slide Body */}
              <div className="my-4 flex-1 flex flex-col justify-center space-y-3">

                {currentSlide.id.includes('cover') && (
                  <div className="text-center py-6 space-y-3">
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Discovery Proposal</h4>
                    <EditableField
                      slideId={currentSlide.id} field="subtitle"
                      defaultValue="Employee Benefits Renewal Strategy"
                      tag="h2"
                      className="text-2xl font-bold leading-tight"
                      style={{ fontFamily: themeConfig.headingFont, color: themeConfig.primaryColor }}
                    />
                    <EditableField
                      slideId={currentSlide.id} field="body"
                      defaultValue="Prepared by LYT Practice Solutions for Evans National clients."
                      className="text-xs text-muted-foreground max-w-xs mx-auto"
                      style={{ fontFamily: themeConfig.bodyFont }}
                    />
                  </div>
                )}

                {(currentSlide.id.includes('quotes') || currentSlide.id.includes('comp')) && (
                  <div className="space-y-2">
                    <div className="border border-slate-200 rounded overflow-hidden bg-white">
                      <table className="w-full text-left text-[9px] border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                            <th className="p-1.5">Carrier</th><th className="p-1.5">Plan Option</th>
                            <th className="p-1.5 text-right">Deductible</th><th className="p-1.5 text-right">Premium</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="p-1.5 font-bold text-slate-700">BCBS</td>
                            <td className="p-1.5">Blue Choice PPO 100</td>
                            <td className="p-1.5 text-right font-mono">$1,500</td>
                            <td className="p-1.5 text-right font-bold font-mono" style={{ color: themeConfig.primaryColor }}>$45,100/mo</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-bold text-slate-700">Beam</td>
                            <td className="p-1.5">Smart PPO 1500</td>
                            <td className="p-1.5 text-right font-mono">$50</td>
                            <td className="p-1.5 text-right font-bold font-mono" style={{ color: themeConfig.primaryColor }}>$1,383/mo</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <EditableField
                      slideId={currentSlide.id} field="body"
                      defaultValue="* Enrollment aligned using 48-life normalized medical census basis."
                      className="text-[9px] text-muted-foreground leading-relaxed italic"
                      style={{ fontFamily: themeConfig.bodyFont }}
                    />
                  </div>
                )}

                {(currentSlide.id.includes('cost_sum') || currentSlide.id.includes('funding')) && (
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="border border-slate-200 rounded p-2.5 bg-white space-y-1">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase block">Scenario 1: Cost-Optimized</span>
                      <div className="text-sm font-bold text-slate-800">$23,033.12 <span className="text-[9px] font-normal">/mo</span></div>
                      <p className="text-[8px] text-muted-foreground leading-snug">HMO Medical + baseline ancillary packages.</p>
                    </div>
                    <div className="border-2 rounded p-2.5 bg-white space-y-1" style={{ borderColor: themeConfig.primaryColor }}>
                      <span className="text-[9px] font-bold uppercase block" style={{ color: themeConfig.primaryColor }}>Scenario 2: Recommended</span>
                      <div className="text-sm font-bold" style={{ color: themeConfig.primaryColor }}>$26,383.12 <span className="text-[9px] font-normal">/mo</span></div>
                      <p className="text-[8px] text-muted-foreground leading-snug">Mid-tier PPO with optimized deductible structure.</p>
                    </div>
                  </div>
                )}

                {!currentSlide.id.includes('cover') &&
                 !currentSlide.id.includes('quotes') &&
                 !currentSlide.id.includes('comp') &&
                 !currentSlide.id.includes('cost_sum') &&
                 !currentSlide.id.includes('funding') && (
                  <div className="space-y-2 py-4">
                    <EditableField
                      slideId={currentSlide.id} field="body"
                      defaultValue={`This slide is configured using pattern matching tokens extracted from ${uploadedStyleFile || 'Default Style'}. Real-time data from active connections is injected here.`}
                      className="text-xs text-slate-700 leading-relaxed"
                      style={{ fontFamily: themeConfig.bodyFont }}
                    />
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50/50 p-2 rounded border border-emerald-100/50">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active telemetry data successfully parsed & mapped.
                    </div>
                  </div>
                )}
              </div>

              {/* Slide Footer */}
              <div className="flex justify-between items-center text-[9px] text-muted-foreground border-t border-slate-200/60 pt-2">
                <span style={{ fontFamily: themeConfig.bodyFont }}>Confidential - Prepared by LYT Group</span>
                <span>Slide {activeSlideIndex + 1} of {enabledSlides.length}</span>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-muted-foreground py-10 space-y-2">
              <Presentation className="h-8 w-8 text-muted-foreground/30" />
              <div>No slides enabled. Enable slides in the Output Builder tab.</div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Navigator Footer */}
      {enabledSlides.length > 0 && (
        <div className="p-3 bg-muted/40 border-t border-border/40 flex items-center justify-between">
          <Button
            size="sm" variant="outline" className="text-xs"
            onClick={() => setActiveSlideIndex(prev => (prev - 1 + enabledSlides.length) % enabledSlides.length)}
          >
            Prev Slide
          </Button>

          <Button
            size="sm" onClick={downloadDraftPDF} disabled={isGeneratingPDF}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 font-bold transition-transform active:scale-[0.97]"
          >
            {isGeneratingPDF ? (
              <><LoopIcon className="h-3.5 w-3.5 animate-spin" />Compiling...</>
            ) : (
              <><Download className="h-3.5 w-3.5" />Download PDF</>
            )}
          </Button>

          <Button
            size="sm" variant="outline" className="text-xs"
            onClick={() => setActiveSlideIndex(prev => (prev + 1) % enabledSlides.length)}
          >
            Next Slide
          </Button>
        </div>
      )}
    </Card>
  );
}
